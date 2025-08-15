import React from 'react';
import './about.scss';

function About() {
  return (
    <div className="app">
      <section className="hero">
        <div className="container hero-content">
          <div className="text-content">
            <h2>Thời trang hiện đại cho bạn</h2>
            <p>Khám phá các mẫu quần áo mới nhất, giúp bạn nổi bật với phong cách riêng.</p>
            <a href="#about" className="btn">Tìm hiểu thêm</a>
          </div>
          <div className="image-content">
            <img
              src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
              alt="Fashion model"
            />
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="container about-content">
          <div className="image-block">
            <img
              src="https://images.unsplash.com/photo-1521336575822-6da63fb45455"
              alt="Cloth Shop Storefront"
            />
          </div>
          <div className="text-block">
            <h3>Về Cloth Shop</h3>
            <p>
              Tại Cloth Shop, chúng tôi không chỉ bán quần áo – chúng tôi giúp bạn thể hiện cá tính.
              Với sự chọn lọc kỹ lưỡng, chất liệu cao cấp và thiết kế tinh tế, mỗi bộ trang phục
              đều mang đến sự tự tin và thoải mái tối đa.
            </p>
            <p>
              Hãy cùng khám phá thế giới thời trang của bạn tại Cloth Shop – nơi xu hướng và phong cách giao thoa.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
