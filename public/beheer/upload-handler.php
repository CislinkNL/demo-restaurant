<?php
/**
 * 图片上传处理器 - 餐厅管理系统专用
 * Image Upload Handler - Restaurant Management System
 */

// 启用CORS支持，允许前端调用
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 只接受POST请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// FTP配置 - 建议通过环境变量获取
$ftp_server = "ftp.cislink.nl";
$ftp_username = "kim@cislink.nl";
$ftp_userpass = "9eI6wIbje"; // 生产环境建议使用环境变量

// 允许的文件扩展名
$allowed_extensions = ['png', 'webp', 'jpg', 'jpeg'];
$max_file_size = 5 * 1024 * 1024; // 5MB

// 响应函数
function sendResponse($success, $data = null, $error = null) {
    $response = ['success' => $success];
    if ($data) $response = array_merge($response, $data);
    if ($error) $response['error'] = $error;
    echo json_encode($response);
    exit();
}

// 检查是否有文件上传
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    sendResponse(false, null, '文件上传失败或未选择文件');
}

$uploaded_file = $_FILES['image'];
$filename = basename($uploaded_file['name']);
$file_extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$file_size = $uploaded_file['size'];
$local_file = $uploaded_file['tmp_name'];

// 验证文件扩展名
if (!in_array($file_extension, $allowed_extensions)) {
    sendResponse(false, null, '不支持的文件格式。请上传 PNG、WEBP、JPG 或 JPEG 文件');
}

// 验证文件大小
if ($file_size > $max_file_size) {
    sendResponse(false, null, '文件大小超过限制（最大5MB）');
}

// 验证文件是否为图片
$image_info = getimagesize($local_file);
if ($image_info === false) {
    sendResponse(false, null, '上传的文件不是有效的图片');
}

// 生成唯一文件名以避免冲突
$unique_filename = time() . '_' . uniqid() . '.' . $file_extension;

// 建立FTP连接
$conn_id = ftp_connect($ftp_server);
if (!$conn_id) {
    sendResponse(false, null, 'FTP服务器连接失败');
}

// 登录FTP
$login_result = ftp_login($conn_id, $ftp_username, $ftp_userpass);
if (!$login_result) {
    ftp_close($conn_id);
    sendResponse(false, null, 'FTP登录失败');
}

// 启用被动模式
ftp_pasv($conn_id, true);

// 上传文件
$upload_result = ftp_put($conn_id, $unique_filename, $local_file, FTP_BINARY);

if ($upload_result) {
    // 上传成功，生成文件URL
    $file_url = "https://cislink.nl/asianboulervard/foto/" . $unique_filename;
    
    // 获取图片尺寸信息
    $width = $image_info[0];
    $height = $image_info[1];
    $file_size_mb = round($file_size / (1024 * 1024), 2);
    
    sendResponse(true, [
        'url' => $file_url,
        'filename' => $unique_filename,
        'original_name' => $filename,
        'size' => $file_size_mb . 'MB',
        'dimensions' => $width . 'x' . $height,
        'type' => $image_info['mime']
    ]);
} else {
    sendResponse(false, null, '文件上传到服务器失败');
}

// 关闭FTP连接
ftp_close($conn_id);
?>