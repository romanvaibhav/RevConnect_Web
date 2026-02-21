package com.revconnect.RevConnectWeb.entity;


import jakarta.persistence.*;

@Entity
@Table(name="business_profiles")
public class BusinessProfile {

    @Id
    @Column(name="user_id")
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name="user_id")
    private User user;

    @Column(nullable = false)
    private String category;

    @Column(name="detailed_bio", length = 2000)
    private String detailedBio;

    @Column(name="contact_email")
    private String contactEmail;

    private String address;

    public BusinessProfile(){}

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDetailedBio() {
        return detailedBio;
    }

    public void setDetailedBio(String detailedBio) {
        this.detailedBio = detailedBio;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
