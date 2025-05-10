"use strict";
// import mongoose from "mongoose";
// const UserActivitySchema = new mongoose.Schema({
//     user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     activity_type: { type: String, required: true },
//     page: String,
//     details: mongoose.Schema.Types.Mixed,
//     ip_address: String,
//     session_id: String,
//     device_info: {
//       browser: String,
//       os: String,
//       device: String
//     },
//     created_at: { type: Date, default: Date.now }
//   });
//   const trackActivity = async (userId, activityType, req, details = {}) => {
//     try {
//       const userAgent = req.headers['user-agent'];
//       // You might want to use a user-agent parser library here
//       await UserActivity.create({
//         user_id: userId,
//         activity_type: activityType,
//         page: req.originalUrl,
//         details: details,
//         ip_address: req.ip,
//         session_id: req.session?.id,
//         device_info: {
//           browser: 'Detected from user-agent',
//           os: 'Detected from user-agent',
//           device: 'Detected from user-agent'
//         }
//       });
//     } catch (error) {
//       console.error('Error tracking activity:', error);
//     }
//   };
