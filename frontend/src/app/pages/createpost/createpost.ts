import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Postservice } from '../../cors/postService/postservice'; // update path if needed

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './createpost.html',
  styleUrl: './createpost.css',
})
export class CreatePost {
  postText = '';
  maxLen = 500;

  isPosting = false;
  successMsg = '';
  errorMsg = '';

  constructor(private postService: Postservice) {}

  get remainingChars(): number {
    return this.maxLen - (this.postText?.length || 0);
  }

  canPost(): boolean {
    const text = this.postText.trim();
    return !!text && !this.isPosting && text.length <= this.maxLen;
  }

  onCreatePost(): void {
    this.successMsg = '';
    this.errorMsg = '';

    const text = this.postText.trim();
    if (!text) {
      this.errorMsg = 'Write something before posting.';
      return;
    }
    if (text.length > this.maxLen) {
      this.errorMsg = `Max ${this.maxLen} characters allowed.`;
      return;
    }

    this.isPosting = true;

    // ✅ Call your service exactly as it is (expects postData object)
    this.postService.createPosts({ content: text }).subscribe({
      next: (res: any) => {
        console.log('Post created', res);
        this.postText = '';
        this.successMsg = 'Post created successfully ✅';
        this.isPosting = false;
      },
      error: (err: any) => {
        console.error('Create post failed', err);
        this.errorMsg = err?.error?.message || 'Failed to create post. Please try again.';
        this.isPosting = false;
      },
    });
  }

  clear(): void {
    this.postText = '';
    this.successMsg = '';
    this.errorMsg = '';
  }
}
