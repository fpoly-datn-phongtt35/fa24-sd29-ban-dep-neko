package com.example.sd29.repository;

import com.example.sd29.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {

    List<Customer> findByCity(String city);
    @Query("SELECT e FROM Customer e WHERE e.name LIKE %:keyword% OR e.email LIKE %:keyword%")
    Page<Customer> searchByKeyword(String keyword, Pageable pageable);
}
