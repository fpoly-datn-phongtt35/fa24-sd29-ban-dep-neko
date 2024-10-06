package com.example.sd29.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {
    // @MappedSuperclass: Chỉ ra rằng class này sẽ không được ánh xạ trực tiếp vào bảng trong cơ sở dữ liệu,
    // nhưng các trường của nó sẽ được kế thừa bởi các entity con.
    // @CreatedDate và @LastModifiedDate: Dùng để tự động cập nhật thời gian tạo và cập nhật bản ghi.
    // @PrePersist và @PreUpdate: Các method này sẽ được gọi tự động trước khi lưu và cập nhật bản ghi.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
