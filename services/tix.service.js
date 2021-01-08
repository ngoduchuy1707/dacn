// const { Tix } = require("../models/tix.model");
// const errorResult = require("../config/errors/errorResult");
// const mongoose = require("mongoose");


// //GET TIX
// module.exports.getTix = async (req, res, next) => {
//     try {
//         const tix = await Tix.find();
//         if (!tix) {
//             throw {
//                 error: errorResult.badRequest
//             }
//         }
//         if (tix.length < 1) {
//             throw { error: null }
//         }
//         return res.json({
//             message: errorResult.success,
//             data: tix
//         });
//     } catch (error) {
//         return res.json(error);
//     }
// }

// //GET TIX BY ID
// module.exports.getTixById = async (req, res, next) => {
//     try {
//         const { tixId } = req.params;
//         const tix = await Tix.findById(tixId);
//         if (!tix) {
//             throw {
//                 error: errorResult.notFound
//             }
//         }
//         return res.json({
//             message: errorResult.success,
//             data: tix
//         });
//     } catch (error) {
//         return res.json(error);
//     }
// }

// //CREATE TIX
// module.exports.createTix = async (req, res, next) => {
//     try {
//         const { tix_Name, tix_Price } = req.body;
//         const tixName = await Tix.find({ tix_Name });
//         if (tixName.length > 0) {
//             throw {
//                 error: errorResult.badRequest
//             }
//         }
//         const tix = await Tix.create({
//             tix_Name, tix_Price
//         });
//         return res.json({
//             message: errorResult.success,
//             data: tix
//         });
//     } catch (error) {
//         return res.json(error);
//     }
// }

// // UPDATE TIX
// module.exports.updateTix = async (req, res, next) => {
//     try {
//         const { tixId } = req.params;
//         const { tix_Name, tix_Price } = req.body;
//         const tix = await Tix
//             .findByIdAndUpdate(
//                 { _id: tixId },
//                 { tix_Name, tix_Price },
//                 { new: true }
//             );
//         if (!tix) {
//             throw {
//                 error: errorResult.notFound
//             }
//         } else {
//             return res.json({
//                 message: errorResult.success,
//                 data: tix
//             });
//         }
//     } catch (error) {
//         return res.json(error);
//     }
// }

// //DELETE TIX
// module.exports.deleteTix = async (req, res, next) => {
//     try {
//         const { tixId } = req.params;
//         const tix = await Tix.findById(tixId);
//         let _tix;
//         if (!tix) {
//             throw {
//                 error: errorResult.notFound
//             }
//         } else {
//             _tix = tix
//             tix.deleteOne();
//         }
//         return res.json({
//             message: errorResult.success,
//             data: _tix
//         });
//     } catch (error) {
//         return res.json(error);
//     }
// }