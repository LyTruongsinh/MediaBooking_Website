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
                    exclude: ["password"] // không lấy trường password
                },
                raw: true, // trả về dữ liệu thô
                nest: true, // trả về dữ liệu dạng json
                where : { // chỉ lấy những người có vai trò là bác sĩ
                    roleId: "R2",
                },
                include: [ // lấy thêm thông tin về vị trí và giới tính
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
            })
            resolve({
                errCode: 0,
                message: "Get top doctor succeed",
                data: users // trả về danh sách bác sĩ
            })
        }
        catch (e) {
            reject(e); // ngay khi chạy reject thì ở Controller sẽ bắt error qua hàm catch
        }
    });
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
}