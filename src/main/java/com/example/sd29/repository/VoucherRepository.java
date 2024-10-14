package com.example.sd29.repository;

import com.example.sd29.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    Page<Voucher> findAllByOrderByCreateAtDesc(Pageable pageable);

    @Query(value = "SELECT DISTINCT v.* FROM voucher v "
            + "LEFT JOIN customer_voucher cv ON v.id = cv.voucher_id "
            + "LEFT JOIN customer c ON cv.customer_id = c.id "
            + "LEFT JOIN brand_voucher bv ON v.id = bv.voucher_id "
            + "LEFT JOIN brand b ON bv.brand_id = b.id "
            + "WHERE (:type IS NULL OR v.type = :type) "
            + "AND (:isActive IS NULL OR v.is_active = :isActive) "
            + "AND (:minAmount IS NULL OR v.min_purchase_amount >= :minAmount) "
            + "AND (:maxAmount IS NULL OR v.min_purchase_amount <= :maxAmount) "
            + "AND (:minValue IS NULL OR v.discount >= :minValue) "
            + "AND (:maxValue IS NULL OR v.discount <= :maxValue) "
            + "AND (:brandId IS NULL OR b.id = :brandId) "
            + "AND (:keywork IS NULL OR "
            + "    (ISNUMERIC(:keywork) = 1 AND v.discount = CAST(:keywork AS FLOAT)) " // Tìm theo số
            + "    OR c.name LIKE CONCAT('%', :keywork, '%'))" // Tìm kiếm theo tên khách hàng
            + "ORDER BY v.create_at DESC",
            countQuery = "SELECT COUNT(DISTINCT v.id) FROM voucher v "
                    + "LEFT JOIN customer_voucher cv ON v.id = cv.voucher_id "
                    + "LEFT JOIN customer c ON cv.customer_id = c.id "
                    + "LEFT JOIN brand_voucher bv ON v.id = bv.voucher_id "
                    + "LEFT JOIN brand b ON bv.brand_id = b.id "
                    + "WHERE (:type IS NULL OR v.type = :type) "
                    + "AND (:isActive IS NULL OR v.is_active = :isActive) "
                    + "AND (:minAmount IS NULL OR v.min_purchase_amount >= :minAmount) "
                    + "AND (:maxAmount IS NULL OR v.min_purchase_amount <= :maxAmount) "
                    + "AND (:minValue IS NULL OR v.discount >= :minValue) "
                    + "AND (:maxValue IS NULL OR v.discount <= :maxValue) "
                    + "AND (:brandId IS NULL OR b.id = :brandId) "
                    + "AND (:keywork IS NULL OR "
                    + "    (ISNUMERIC(:keywork) = 1 AND v.discount = CAST(:keywork AS FLOAT)) "
                    + "    OR c.name LIKE CONCAT('%', :keywork, '%'))",
            nativeQuery = true)
    Page<Voucher> searchVouchers(
            @Param("keywork") String keywork,
            @Param("type") String type,
            @Param("brandId") Integer brandId,
            @Param("isActive") Boolean isActive,
            @Param("minAmount") Double minAmount,
            @Param("maxAmount") Double maxAmount,
            @Param("minValue") Double minValue,
            @Param("maxValue") Double maxValue,
            Pageable pageable);
}
