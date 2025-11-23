/**
 * MessageRoutes.js
 * Định nghĩa các routes cho chức năng chat
 * Đồ án: Hệ thống Bus Tracking - Chức năng Chat Realtime
 * 
 * Mô tả: File này định nghĩa các endpoint API cho tin nhắn
 */

const express = require('express');
const router = express.Router();
const MessageController = require('../Controllers/MessageController');

/**
 * @route   GET /api/messages/history/:adminId/:driverId
 * @desc    Lấy lịch sử tin nhắn giữa Admin và Tài xế
 * @access  Private
 * @param   {number} adminId - ID của Admin
 * @param   {number} driverId - ID của Tài xế
 * @query   {number} limit - Số lượng tin nhắn tối đa (mặc định 100)
 * @return  {Array} Danh sách tin nhắn
 */
router.get('/history/:adminId/:driverId', MessageController.getMessageHistory);

/**
 * @route   GET /api/messages/drivers/:adminId
 * @desc    Lấy danh sách tài xế đã nhắn tin với Admin
 * @access  Private
 * @param   {number} adminId - ID của Admin
 * @return  {Array} Danh sách tài xế với tin nhắn cuối cùng
 */
router.get('/drivers/:adminId', MessageController.getDriverList);

/**
 * @route   GET /api/messages/unread-count/:userId/:userRole
 * @desc    Đếm số tin nhắn chưa đọc của user
 * @access  Private
 * @param   {number} userId - ID người dùng
 * @param   {string} userRole - Vai trò (admin/taixe)
 * @return  {number} Số tin nhắn chưa đọc
 */
router.get('/unread-count/:userId/:userRole', MessageController.getUnreadCount);

/**
 * @route   POST /api/messages/send
 * @desc    Gửi tin nhắn mới (backup cho Socket.IO)
 * @access  Private
 * @body    {Object} messageData - Dữ liệu tin nhắn
 * @return  {Object} Thông tin tin nhắn đã gửi
 */
router.post('/send', MessageController.sendMessage);

/**
 * @route   PUT /api/messages/mark-read
 * @desc    Đánh dấu tin nhắn đã đọc
 * @access  Private
 * @body    {number} userId - ID người đọc
 * @body    {string} userRole - Vai trò người đọc
 * @body    {number} partnerId - ID người gửi
 * @body    {string} partnerRole - Vai trò người gửi
 * @return  {Object} Kết quả cập nhật
 */
router.put('/mark-read', MessageController.markAsRead);

/**
 * @route   DELETE /api/messages/history/:adminId/:driverId
 * @desc    Xóa lịch sử tin nhắn (chỉ dùng test)
 * @access  Private
 * @param   {number} adminId - ID Admin
 * @param   {number} driverId - ID Tài xế
 * @return  {Object} Kết quả xóa
 */
router.delete('/history/:adminId/:driverId', MessageController.deleteHistory);

module.exports = router;
