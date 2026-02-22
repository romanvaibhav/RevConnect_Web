package com.revconnect.RevConnectWeb.repository;

import com.revconnect.RevConnectWeb.entity.Profiles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profiles,Long> {

    List<Profiles> findByNameContainingIgnoreCase(String name);}
