import { Component, OnInit } from '@angular/core';
import { Profileservice } from '../../cors/profileService/profileservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  profile: any = null;

  activeTab: 'posts' | 'saved' | 'shared' = 'posts';

  isEditOpen = false;
  isSaving = false;

  errorMsg = '';
  successMsg = '';

  // Editable form model (prefilled on open)
  editForm: any = {
    name: '',
    bio: '',
    location: '',
    websiteUrl: '',
    profilePicUrl: '',
    privacy: 'public',
  };

  constructor(private profileService: Profileservice) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.getUserPosts();
  }

  getUserProfile(): void {
    this.profileService.getUserProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
      },
    });
  }

  openEditModal(): void {
    if (!this.profile) return;

    // Prefill values
    this.editForm = {
      name: this.profile.name || '',
      bio: this.profile.bio || '',
      location: this.profile.location || '',
      websiteUrl: this.profile.websiteUrl || '',
      profilePicUrl: this.profile.profilePicUrl || '',
      privacy: this.profile.privacy || 'public',
    };

    this.errorMsg = '';
    this.successMsg = '';
    this.isEditOpen = true;
  }

  closeEditModal(): void {
    this.isEditOpen = false;
  }

  saveProfile(): void {
    this.isSaving = true;
    this.errorMsg = '';
    this.successMsg = '';

    // Payload for backend
    const payload = {
      ...this.editForm,
      // if your backend expects userId, add it
      // userId: this.profile?.userId
    };

    console.log('Updating profile with payload:', payload);

    this.profileService.updateProfile(payload).subscribe({
      next: (updated) => {
        // If backend returns updated profile
        this.profile = updated ?? { ...this.profile, ...payload };
        this.successMsg = 'Profile updated successfully!';
        this.isSaving = false;

        // close after small delay (optional)
        setTimeout(() => this.closeEditModal(), 400);
      },
      error: (err) => {
        console.error('Update failed', err);
        this.errorMsg = 'Failed to update profile.';
        this.isSaving = false;
      },
    });
  }

  formatWebsite(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  }

  posts: any[] = [];

  getUserPosts(): void {
    this.profileService.getUserPosts().subscribe({
      next: (data) => {
        this.posts = data;
        console.log('User posts:', data);
      },
      error: (err) => {
        console.error('Failed to load posts', err);
      },
    });
  }
}
