import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { registerKol, getKolStatus } from '../../../services/kolService';
import { useNavigate } from 'react-router-dom';
import './KolRegistrationForm.scss';

/**
 * Component Form Đăng Ký KOL
 * Cho phép người dùng đăng ký làm KOL bằng cách cung cấp liên kết mạng xã hội và tài liệu nhận dạng
 * 
 * Yêu cầu:
 * 1.1 - Hiển thị form để nhập liên kết mạng xã hội và tải lên tài liệu nhận dạng
 * 1.2 - Xác thực rằng tất cả các trường bắt buộc đã được hoàn thành
 */
const KolRegistrationForm = () => {
    const navigate = useNavigate();

    // Dữ liệu người dùng từ local storage
    const [userData, setUserData] = useState(null);

    // Trạng thái form - thay đổi cấu trúc social media links
    const [socialMediaLinks, setSocialMediaLinks] = useState([]);

    const [identificationDocument, setIdentificationDocument] = useState({
        documentType: 'nationalId',
        documentNumber: '',
        documentImage: null
    });

    // Trạng thái xác thực form
    const [errors, setErrors] = useState({});

    // Trạng thái loading
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Trạng thái đồng ý điều khoản
    const [agreeTerms, setAgreeTerms] = useState(false);

    // Kiểm tra xem người dùng đã là KOL hoặc có đơn đăng ký đang chờ xử lý
    const [existingApplication, setExistingApplication] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Danh sách các nền tảng mạng xã hội có sẵn
    const availablePlatforms = [
        { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/tênngườidùng' },
        { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/tênngườidùng' },
        { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@tênngườidùng' },
        { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/c/tênkênh' },
        { value: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/tênngườidùng' },
        { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/tênngườidùng' },
        { value: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/tênngườidùng' },
        { value: 'snapchat', label: 'Snapchat', placeholder: 'tênngườidùng' },
        { value: 'telegram', label: 'Telegram', placeholder: '@tênngườidùng' },
        { value: 'other', label: 'Khác', placeholder: 'https://mạngxãhộikhác.com/tênngườidùng' }
    ];

    // State cho Thông tin cơ bản
    const [basicInfo, setBasicInfo] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: '',
        phone: '',
    });


    // Lấy dữ liệu người dùng và kiểm tra trạng thái đơn đăng ký khi component mount
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // Lấy dữ liệu người dùng từ local storage
                const user = JSON.parse(localStorage.getItem('userData'));

                // if (!isMounted) return;
                // setUserData(user);

                // if (!user) {
                //     // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
                //     toast.error('Vui lòng đăng nhập để đăng ký làm KOL');
                //     navigate('/login');
                //     return;
                // }

                // Kiểm tra xem người dùng đã có đơn đăng ký KOL chưa
                const response = await getKolStatus();

                if (!isMounted) return;

                if (response && response.data.hasApplied) {
                    setExistingApplication(response.data);

                    // Nếu đơn đăng ký được chấp thuận, chuyển hướng đến trang KOL dashboard
                    if (response.data.status === 'approved') {
                        navigate('/user/kol/dashboard');
                    }

                    // Nếu đơn đăng ký đang chờ xử lý, hiển thị thông tin đã gửi
                    if (response.data.status === 'pending') {
                        toast.info('Đơn đăng ký KOL của bạn đang được xem xét. Dưới đây là thông tin bạn đã gửi:');

                        // Hiển thị thông tin social media links đã gửi
                        if (response.data.socialMediaLinks) {
                            try {
                                const socialLinks = typeof response.data.socialMediaLinks === 'string'
                                    ? JSON.parse(response.data.socialMediaLinks)
                                    : response.data.socialMediaLinks;

                                const newLinks = Object.entries(socialLinks)
                                    .filter(([_, url]) => url && url.trim() !== '')
                                    .map(([platform, url]) => ({
                                        id: Date.now() + Math.random(),
                                        platform,
                                        url: url.trim()
                                    }));
                                setSocialMediaLinks(newLinks);
                            } catch (error) {
                                console.error('Lỗi khi parse social media links:', error);
                            }
                        }


                    }

                    // Nếu đơn đăng ký bị từ chối, điền sẵn form với dữ liệu trước đó
                    if (response.data.status === 'rejected') {
                        if (response.data.socialMediaLinks) {
                            // Chuyển đổi từ object sang array format mới
                            const oldLinks = typeof response.data.socialMediaLinks === 'string'
                                ? JSON.parse(response.data.socialMediaLinks)
                                : response.data.socialMediaLinks;

                            const newLinks = Object.entries(oldLinks)
                                .filter(([_, url]) => url && url.trim() !== '')
                                .map(([platform, url]) => ({
                                    id: Date.now() + Math.random(),
                                    platform,
                                    url: url.trim()
                                }));
                            setSocialMediaLinks(newLinks);
                        }

                        if (response.data.identificationDocument) {
                            const docData = typeof response.data.identificationDocument === 'string'
                                ? JSON.parse(response.data.identificationDocument)
                                : response.data.identificationDocument;

                            setIdentificationDocument(prev => ({
                                ...prev,
                                documentType: docData.documentType || 'nationalId',
                                documentNumber: docData.documentNumber || '',
                                // Không điền sẵn hình ảnh vì cần tải lên lại
                            }));
                        }

                        toast.warning('Đơn đăng ký trước của bạn đã bị từ chối. Bạn có thể gửi đơn đăng ký mới.');
                    }
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Lỗi khi lấy trạng thái KOL:', error);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array để chỉ chạy 1 lần khi mount

    // Thêm liên kết mạng xã hội mới
    const addSocialMediaLink = () => {
        const newLink = {
            id: Date.now() + Math.random(),
            platform: '',
            url: ''
        };
        setSocialMediaLinks(prev => [...prev, newLink]);
    };

    // Xóa liên kết mạng xã hội
    const removeSocialMediaLink = (id) => {
        setSocialMediaLinks(prev => prev.filter(link => link.id !== id));
        // Xóa lỗi khi xóa link
        if (errors.socialMedia) {
            setErrors(prev => ({ ...prev, socialMedia: null }));
        }
    };

    // Xử lý thay đổi liên kết mạng xã hội
    const handleSocialMediaChange = (id, field, value) => {
        setSocialMediaLinks(prev =>
            prev.map(link =>
                link.id === id ? { ...link, [field]: value } : link
            )
        );

        // Xóa lỗi khi người dùng bắt đầu nhập
        if (errors.socialMedia) {
            setErrors(prev => ({ ...prev, socialMedia: null }));
        }
    };



    // Xử lý tải lên hình ảnh tài liệu
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Xác thực kích thước file (tối đa 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    documentImage: 'Kích thước file phải nhỏ hơn 5MB'
                }));
                return;
            }

            // Xác thực loại file
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    documentImage: 'Chỉ chấp nhận file JPG, JPEG và PNG'
                }));
                return;
            }

            // Chuyển đổi sang base64 để xem trước và gửi
            const reader = new FileReader();
            reader.onloadend = () => {
                setIdentificationDocument(prev => ({
                    ...prev,
                    documentImage: reader.result
                }));

                // Xóa lỗi khi tải lên hình ảnh hợp lệ
                if (errors.documentImage) {
                    setErrors(prev => ({ ...prev, documentImage: null }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Xử lý thay đổi đồng ý điều khoản
    const handleTermsChange = (e) => {
        setAgreeTerms(e.target.checked);
    };

    // Xác thực định dạng URL
    const isValidUrl = (url) => {
        if (!url) return true; // URL trống được phép (sẽ được xác thực riêng)
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Xác thực form
    const validateForm = () => {
        const newErrors = {};

        if (!basicInfo?.fullName?.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        } else if (basicInfo.fullName.trim().length < 2) {
            newErrors.fullName = 'Họ và tên quá ngắn';
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!basicInfo?.email?.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!emailRegex.test(basicInfo.email.trim())) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Mật khẩu
        if (!basicInfo?.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (basicInfo.password.length < 6) {
            newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
        }

        // Nhập lại mật khẩu
        if (!basicInfo?.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
        } else if (basicInfo.confirmPassword !== basicInfo.password) {
            newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
        }

        // Ngày sinh (>= 16 tuổi)
        if (!basicInfo?.dob) {
            newErrors.dob = 'Vui lòng chọn ngày sinh';
        } else {
            const dob = new Date(basicInfo.dob);
            const today = new Date();
            if (isNaN(dob.getTime())) {
                newErrors.dob = 'Ngày sinh không hợp lệ';
            } else {
                let age = today.getFullYear() - dob.getFullYear();
                const m = today.getMonth() - dob.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
                if (age < 16) newErrors.dob = 'Bạn cần từ 16 tuổi trở lên';
            }
        }

        // Giới tính
        if (!basicInfo?.gender) {
            newErrors.gender = 'Vui lòng chọn giới tính';
        }

        // Số điện thoại (VN: 10–11 số, bắt đầu 0 hoặc +84)
        const phone = (basicInfo?.phone || '').trim();
        const vnPhoneRegex = /^(0\d{9,10}|\+84\d{9,10})$/;
        if (!phone) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!vnPhoneRegex.test(phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }


        // Xác thực ít nhất một liên kết mạng xã hội được cung cấp
        const validLinks = socialMediaLinks.filter(link =>
            link.platform && link.url && link.url.trim() !== ''
        );

        if (validLinks.length === 0) {
            newErrors.socialMedia = 'Cần ít nhất một liên kết mạng xã hội';
        }

        // Xác thực từng liên kết
        socialMediaLinks.forEach((link, index) => {
            if (link.platform && link.url && link.url.trim() !== '') {
                if (!isValidUrl(link.url)) {
                    newErrors[`socialMedia_${index}`] = 'Vui lòng nhập URL hợp lệ';
                }
            }
        });

        // Xác thực loại tài liệu
        if (!identificationDocument.documentType) {
            newErrors.documentType = 'Loại tài liệu là bắt buộc';
        }


        // Xác thực đồng ý điều khoản
        if (!agreeTerms) {
            newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản và điều kiện';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý gửi form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Xác thực form
        if (!validateForm()) {
            // Cuộn đến lỗi đầu tiên
            const firstError = document.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setIsSubmitting(true);

        try {
            // Chuyển đổi social media links từ array sang object format cho API
            const socialMediaObject = {};
            socialMediaLinks.forEach(link => {
                if (link.platform && link.url && link.url.trim() !== '') {
                    socialMediaObject[link.platform] = link.url.trim();
                }
            });

            // Chuẩn bị dữ liệu cho API
            const registrationData = {
                fullName: basicInfo?.fullName?.trim(),
                email: basicInfo?.email?.trim(),
                password: basicInfo?.password,
                dob: basicInfo?.dob,
                gender: basicInfo?.gender,
                phone: basicInfo?.phone,
                socialMediaLinks: socialMediaObject,
            };
            //console.log('Đang gửi dữ liệu đăng ký KOL:', registrationData);
            // Gọi API để đăng ký KOL
            const response = await registerKol(registrationData);
            console.log(response);

            if (response && response.errCode === 0) {
                toast.success('Đơn đăng ký KOL đã được gửi thành công!');
                // Chuyển hướng đến trang trạng thái
                navigate(`/user/kol/status/${userData.id}`);
            } else {

                toast.error(response?.errMessage || 'Không thể gửi đơn đăng ký KOL');
            }
        } catch (error) {
            console.error('Lỗi khi gửi đơn đăng ký KOL:', error);

            // Xử lý các trường hợp lỗi cụ thể
            if (error.response && error.response.data) {
                const { errCode, errMessage } = error.response.data;

                if (errCode === 2) {
                    toast.warning(errMessage); // Đã có đơn đăng ký đang chờ xử lý
                    navigate(`/user/kol/status/${userData.id}`);
                } else {
                    toast.error(errMessage || 'Đã xảy ra lỗi khi gửi đơn đăng ký của bạn');
                }
            } else {
                toast.error('Đã xảy ra lỗi khi gửi đơn đăng ký của bạn');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hiển thị trạng thái loading khi kiểm tra trạng thái đơn đăng ký
    if (isLoading) {
        return (
            <div className="kol-registration-container">
                <div className="kol-registration-header">
                    <h2>Đăng Ký KOL</h2>
                    <p>Đang tải thông tin của bạn...</p>
                </div>
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    const handleBasicChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo((prev) => ({ ...prev, [name]: value }));
    };

    const validateBasicInfo = (values) => {
        const newErrors = {};

        // Họ và tên
        if (!values.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        } else if (values.fullName.trim().length < 2) {
            newErrors.fullName = 'Họ và tên quá ngắn';
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!values.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!emailRegex.test(values.email.trim())) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Mật khẩu
        if (!values.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (values.password.length < 6) {
            newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
        }

        // Xác nhận mật khẩu
        if (!values.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
        } else if (values.confirmPassword !== values.password) {
            newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
        }

        // Ngày sinh (>= 16 tuổi)
        if (!values.dob) {
            newErrors.dob = 'Vui lòng chọn ngày sinh';
        } else {
            const today = new Date();
            const dob = new Date(values.dob);
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
            if (age < 16) newErrors.dob = 'Bạn cần từ 16 tuổi trở lên';
        }

        // Giới tính
        if (!values.gender) {
            newErrors.gender = 'Vui lòng chọn giới tính';
        }

        // Số điện thoại (VN cơ bản: 10-11 số, bắt đầu 0 hoặc +84)
        const phone = values.phone.trim();
        const vnPhoneRegex = /^(0\d{9,10}|\+84\d{9,10})$/;
        if (!phone) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!vnPhoneRegex.test(phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        return newErrors;
    };


    return (
        <div className="kol-registration-container">
            <div className="kol-registration-header">
                <h2>Đăng Ký KOL</h2>
                <p>Trở thành Key Opinion Leader và kiếm hoa hồng bằng cách quảng cáo sản phẩm của chúng tôi</p>

                {existingApplication && existingApplication.status === 'pending' && (
                    <div className="pending-application-notice">
                        <h4>Đơn Đăng Ký Đang Được Xem Xét</h4>
                        <p>Đơn đăng ký KOL của bạn đã được gửi và đang được xem xét bởi đội ngũ của chúng tôi.</p>
                        <p>Ngày gửi: {new Date(existingApplication.applicationDate).toLocaleDateString('vi-VN')}</p>
                        <p>Trạng thái: <span className="status-pending">Đang chờ xử lý</span></p>
                    </div>
                )}

                {existingApplication && existingApplication.status === 'rejected' && (
                    <div className="previous-application-notice">
                        <p>Đơn đăng ký trước của bạn đã bị từ chối. Lý do: {existingApplication.reason || 'Không được chỉ định'}</p>
                        <p>Bạn có thể gửi đơn đăng ký mới với thông tin đã cập nhật.</p>
                    </div>
                )}
            </div>

            {/* Hiển thị thông tin đã gửi dạng bảng khi đang pending */}
            {existingApplication && existingApplication.status === 'pending' ? (
                <div className="submitted-info-container">
                    <div className="info-section">
                        <h3>Thông Tin Đã Gửi</h3>

                        <div className="info-table">
                            <div className="table-section">
                                <h4>Liên Kết Mạng Xã Hội</h4>
                                <table className="info-table-content">
                                    <thead>
                                        <tr>
                                            <th>Nền Tảng</th>
                                            <th>Liên Kết</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            try {
                                                const socialLinks = typeof existingApplication.socialMediaLinks === 'string'
                                                    ? JSON.parse(existingApplication.socialMediaLinks)
                                                    : existingApplication.socialMediaLinks;

                                                return Object.entries(socialLinks)
                                                    .filter(([_, url]) => url && url.trim() !== '')
                                                    .map(([platform, url]) => {
                                                        const platformInfo = availablePlatforms.find(p => p.value === platform);
                                                        return (
                                                            <tr key={platform}>
                                                                <td>{platformInfo ? platformInfo.label : platform}</td>
                                                                <td>
                                                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                                                        {url}
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        );
                                                    });
                                            } catch (error) {
                                                return (
                                                    <tr>
                                                        <td colSpan="2">Không có dữ liệu</td>
                                                    </tr>
                                                );
                                            }
                                        })()}
                                    </tbody>
                                </table>
                            </div>


                        </div>
                    </div>
                </div>
            ) : (
                /* Hiển thị form đăng ký khi chưa có đơn hoặc đơn bị từ chối */
                <form className="kol-registration-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Thông tin cơ bản</h3>
                        <p className="section-description">
                            Vui lòng cung cấp thông tin cơ bản của bạn.
                        </p>

                        <div className="basic-info-grid">
                            {/* Họ và tên */}
                            <div className="form-group">
                                <label htmlFor="fullName">Họ và tên</label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                    value={basicInfo.fullName}
                                    onChange={handleBasicChange}
                                    placeholder="Nguyễn Văn A"
                                />
                                {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={basicInfo.email}
                                    onChange={handleBasicChange}
                                    placeholder="email@gmail.com"
                                />
                                {errors.email && <div className="error-message">{errors.email}</div>}
                            </div>

                            {/* Mật khẩu */}
                            <div className="form-group">
                                <label htmlFor="password">Mật khẩu</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    value={basicInfo.password}
                                    onChange={handleBasicChange}
                                    placeholder="Tối thiểu 6 ký tự"
                                />
                                {errors.password && <div className="error-message">{errors.password}</div>}
                            </div>

                            {/* Nhập lại mật khẩu */}
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    value={basicInfo.confirmPassword}
                                    onChange={handleBasicChange}
                                    placeholder="Nhập lại mật khẩu"
                                />
                                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                            </div>

                            {/* Ngày sinh */}
                            <div className="form-group">
                                <label htmlFor="dob">Ngày sinh</label>
                                <input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                                    value={basicInfo.dob}
                                    onChange={handleBasicChange}
                                />
                                {errors.dob && <div className="error-message">{errors.dob}</div>}
                            </div>

                            {/* Giới tính */}
                            <div className="form-group">
                                <label htmlFor="gender">Giới tính</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                    value={basicInfo.gender}
                                    onChange={handleBasicChange}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                    <option value="prefer_not_say">Không muốn tiết lộ</option>
                                </select>
                                {errors.gender && <div className="error-message">{errors.gender}</div>}
                            </div>

                            {/* Số điện thoại */}
                            <div className="form-group">
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    value={basicInfo.phone}
                                    onChange={handleBasicChange}
                                    placeholder="Ví dụ: 0901234567"
                                />
                                {errors.phone && <div className="error-message">{errors.phone}</div>}
                            </div>
                        </div>

                        <h3>Liên Kết Mạng Xã Hội</h3>
                        <p className="section-description">
                            Vui lòng cung cấp liên kết đến hồ sơ mạng xã hội của bạn. Cần ít nhất một liên kết.
                        </p>

                        <div className="social-media-links-container">
                            {socialMediaLinks.map((link, index) => (
                                <div key={link.id} className="social-media-link-item">
                                    <div className="link-inputs">
                                        <div className="form-group platform-select">
                                            <select
                                                value={link.platform}
                                                onChange={(e) => handleSocialMediaChange(link.id, 'platform', e.target.value)}
                                                className="form-control"
                                            >
                                                <option value="">Chọn nền tảng</option>
                                                {availablePlatforms.map(platform => (
                                                    <option key={platform.value} value={platform.value}>
                                                        {platform.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group url-input">
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => handleSocialMediaChange(link.id, 'url', e.target.value)}
                                                placeholder={link.platform ?
                                                    availablePlatforms.find(p => p.value === link.platform)?.placeholder ||
                                                    'Nhập liên kết' :
                                                    'Chọn nền tảng trước'
                                                }
                                                className={`form-control ${errors[`socialMedia_${index}`] ? 'is-invalid' : ''}`}
                                            />
                                            {errors[`socialMedia_${index}`] && (
                                                <div className="error-message">{errors[`socialMedia_${index}`]}</div>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeSocialMediaLink(link.id)}
                                            className="btn-remove-link"
                                            title="Xóa liên kết này"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addSocialMediaLink}
                                className="btn-add-link"
                            >
                                <i className="fas fa-plus"></i> Thêm Liên Kết Mạng Xã Hội
                            </button>
                        </div>

                        {errors.socialMedia && (
                            <div className="error-message">{errors.socialMedia}</div>
                        )}
                    </div>


                    <div className="form-section">
                        <h3>Điều Khoản Và Điều Kiện</h3>
                        <div className="terms-container">
                            <p>Bằng việc gửi đơn đăng ký này, bạn đồng ý với các điều khoản sau:</p>
                            <ul>
                                <li>Bạn sẽ chỉ quảng cáo sản phẩm một cách trung thực và có đạo đức</li>
                                <li>Bạn sẽ tiết lộ mối quan hệ đối tác liên kết với nền tảng của chúng tôi</li>
                                <li>Bạn hiểu rằng hoa hồng dựa trên doanh số thực tế</li>
                                <li>Bạn đồng ý với <a href="/terms" target="_blank" rel="noopener noreferrer">Điều Khoản Dịch Vụ</a> và <a href="/privacy" target="_blank" rel="noopener noreferrer">Chính Sách Bảo Mật</a> của chúng tôi</li>
                            </ul>

                            <div className="form-group">
                                <div className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        id="agreeTerms"
                                        name="agreeTerms"
                                        checked={agreeTerms}
                                        onChange={handleTermsChange}
                                        className={errors.agreeTerms ? 'is-invalid' : ''}
                                    />
                                    <label htmlFor="agreeTerms">Tôi đồng ý với điều khoản và điều kiện</label>
                                </div>
                                {errors.agreeTerms && (
                                    <div className="error-message">{errors.agreeTerms}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang Gửi...' : 'Gửi Đơn Đăng Ký'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default KolRegistrationForm;