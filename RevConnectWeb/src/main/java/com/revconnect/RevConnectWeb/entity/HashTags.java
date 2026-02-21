package com.revconnect.RevConnectWeb.entity;


import jakarta.persistence.*;

@Entity
@Table(name="hashtags")
public class HashTags {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="hashtag_id")
    private Long hashtagId;

    @Column(nullable = false, length = 100)
    private String tag;

    public HashTags(){}

    public Long getHashtagId() {
        return hashtagId;
    }

    public void setHashtagId(Long hashtagId) {
        this.hashtagId = hashtagId;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}
