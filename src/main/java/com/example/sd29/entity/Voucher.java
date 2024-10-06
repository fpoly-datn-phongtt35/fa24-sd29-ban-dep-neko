package com.example.sd29.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "voucher")
public class Voucher extends BaseEntity implements Serializable {
    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "discount", nullable = false)
    private Double discount;

    @Column(name = "min_purchase_amount")
    private Double minPurchaseAmount;

    @Column(name = "max_discount")
    private Double maxDiscount;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "user_limit")
    private Integer userLimit;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "description")
    private String description;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "voucher")
    @JsonIgnore
    private Set<Customer_Voucher> customerVouchers;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "voucher")
    @JsonIgnore
    private Set<Brand_Voucher> brandVouchers;

}