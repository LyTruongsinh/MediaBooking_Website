import { raw } from "body-parser";
import db from "../models/index";
import bcrypt from "bcryptjs";
let getTopDoctorHome = (limits) => {
    return new Promise(async (resolve, reject) => {
        try {
            // lấy danh sách bác sĩ có giới hạn số lượng và sắp xếp theo ngày tạo mới nhất
            let users = await db.User.findAll({
                limit: limits,
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["password"], // không lấy trường password
                },
                raw: true, // trả về dữ liệu thô
                nest: true, // trả về dữ liệu dạng json
                where: {
                    // chỉ lấy những người có vai trò là bác sĩ
                    roleId: "R2",
                },
                include: [
                    // lấy thêm thông tin về vị trí và giới tính
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueVi", "valueEn"],
                    },
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueVi", "valueEn"],
                    },
                ],
            });
            resolve({
                errCode: 0,
                message: "Get top doctor succeed",
                data: users, // trả về danh sách bác sĩ
            });
        } catch (e) {
            reject(e); // ngay khi chạy reject thì ở Controller sẽ bắt error qua hàm catch
        }
    });
};
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" }, // chỉ lấy những người có vai trò là bác sĩ
                attributes: {
                    exclude: ["password", "image"], // không lấy trường password
                },
                raw: true, // trả về dữ liệu thô
            });
            resolve({
                errCode: 0,
                message: "Get all doctors succeed",
                data: doctors, // trả về danh sách bác sĩ
            });
        } catch (e) {
            reject(e); // ngay khi chạy reject thì ở Controller sẽ bắt error qua hàm catch
        }
    });
};
let saveDetailInforDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || data.contentHTML || data.contentMarkdown) {
                // Nếu không có trường ID, contentHTML, contentMarkdown
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter",
                });
            } else
            {
                await db.Markdown.save({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Save information succeed!'
                })
            }
        } catch (e) {
            reject(e); // ngay khi chạy reject thì ở Controller sẽ bắt error qua hàm catch
        }
    });
};
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
};
