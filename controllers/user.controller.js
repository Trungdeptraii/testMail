const model = require('../models/index.js');
const coursesUtils = require('../utils/course.js');
const moment = require("moment")
const User = model.User;
const Group = model.Group
const Course = model.Course
const {Op} = require("sequelize")

module.exports = {
    index: async (req, res)=>{
        const {status, keyword, group} = req.query;
        const filter = {
            // deleted_at: {
            //     [Op.not]: null
            // }
        };
        if(group){
            filter.group_id = group
        }
        if(status === 'active' || status === 'inactive'){
            filter.status = status === 'active' ? true : false;
        }
        if(keyword){
            // filter.email = {
            //     [Op.like]: `%${keyword}%`
            // }
            filter[Op.or] = [
                {
                    name: {
                        [Op.iLike]: `%${keyword}%`
                    }
                },
                {
                    email: {
                        [Op.iLike]: `%${keyword}%`
                    }
                }
            ]
        }
        let limit = 3;
        let {page = 1} = req.query;
        const offset = (page - 1)*limit
        const {rows: users, count} = await User.findAndCountAll({
            order: [["id", "desc"]],
            where: filter,
            limit,
            offset,
            include: [
                {
                    model: model.Phone,
                    as: 'phones'
                },
                {
                    model: model.Group,
                    as: "group"
                }
            ]
            // paranoid: false
            // {
            //     status: false,
            //     email: {
            //         [Op.like]: "%user6%"
            //     }
            // }
        });
        const totalPage = Math.ceil(count/limit);
        const groups = await Group.findAll({
            order: [["name", "asc"]]
        })
        res.render("users/index", {users, moment, totalPage, page, groups, req})
    },
    add:async (req, res) =>{
        const courses = await Course.findAll({
            order: [["name", "asc"]]
        })
        res.render("users/add", {courses});
    },
    handleAdd: async (req, res, next)=>{
        const body = req.body;
        const courses = body.courses;
        try {
         const user = await User.create({
            name: body.name, 
            email: body.email, 
            status: +body.status === 1
        });
         if(user){
            if(courses.length){
                for(let i=0; i<courses.length; i++){
                    const course = await Course.findByPk(courses[i]);
                    await user.addCourse(course)
                }
            }
            return res.redirect("/users")
         }
        } catch (e) {
            return next(e); //Gọi hanlde Error
        }
    },
    edit: async (req, res, next)=>{
       const id = req.params.id;
       try {
        // const user = await User.findByPk(id);
        const user = await User.findOne({
            where: {id},
            include: [
                {
                    model: model.Course,
                    as: "courses"
                }
            ]
        });
        // const phones = await user.getPhone();
        // const phone = phones.phone;
        // console.log('phonezz', phone);
        if(!user){
            throw new Error("User không tồn tại")
        }
        // const phone = await model.Phone.findOne({
        //     where: {
        //        phone: {
        //         [Op.eq]: '12345678'
        //        }
        //     }
        // })
        const courses = await Course.findAll({
            order: [["name", "asc"]]
        })
        res.render('users/edit', {user, courses, coursesUtils: coursesUtils.isCourse})
       } catch (e) {
        return next(e)
       }
    },
    handleEdit:async (req, res)=>{
        const {id} = req.params;
        const body = req.body;
        const courses = body.courses;
        try {
            const status = await User.update({
                name: body.name, 
                email: body.email, 
                status: +body.status === 1
            }, {where: {id}});
            if(status && courses.length){
                const courseRequest = await Promise.all(courses.map(courseId=>Course.findByPk(courseId)));
                const user = await User.findByPk(id);
                await user.setCourses(courseRequest)
            }
            return res.redirect("/users/edit/"+id);
        } catch (error) {
            
        }
    },
    delete: async (req, res)=>{
        const {id} = req.params;
        await User.destroy({where: {id}, force: true})
        return res.redirect("/users")
    }
}