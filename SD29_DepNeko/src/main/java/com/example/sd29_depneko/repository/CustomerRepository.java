package com.example.sd29_depneko.repository;

import com.example.sd29_depneko.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    List<Customer> findByCity(String city);

    @Query("SELECT e FROM Customer e WHERE e.name LIKE %:keyword% OR e.email LIKE %:keyword%")
    Page<Customer> searchByKeyword(String keyword, Pageable pageable);



}
