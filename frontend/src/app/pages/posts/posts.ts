import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Postservice } from '../../cors/postService/postservice';

export interface Post {
  id: number;
  content: string;
  createdAt?: string;
  username?: string;
  likeCount?: number;
  commentCount?: number;
}

export interface Comment {
  id: number;
  postId: number;
  text: string;
  createdAt?: string;
  username?: string;
}

@Component({
  selector: 'app-posts',
  imports: [CommonModule],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit {
  posts: Post[] = [];
  loadingPosts = false;

  // Comments drawer state
  isCommentsOpen = false;
  activePost: Post | null = null;
  comments: Comment[] = [];
  loadingComments = false;

  newCommentText = '';
  likingPostIds = new Set<number>();

  constructor(private postsService: Postservice) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.loadingPosts = true;
    this.postsService.getAllPosts().subscribe({
      next: (data) => {
        console.log('Posts fetched:', data);
        this.posts = Array.isArray(data) ? data : (data as any);
        this.loadingPosts = false;
      },
      error: (err) => {
        console.error('Failed to load posts', err);
        this.loadingPosts = false;
      },
    });
  }

  // onLike(post: Post): void {
  //   if (this.likingPostIds.has(post.id)) return;

  //   this.likingPostIds.add(post.id);

  //   // Optimistic UI
  //   post.likeCount = (post.likeCount ?? 0) + 1;

  //   this.postsService.postLike(post.id).subscribe({
  //     next: () => {
  //       this.likingPostIds.delete(post.id);
  //     },
  //     error: (err) => {
  //       console.error('Like failed', err);
  //       // rollback optimistic update
  //       post.likeCount = Math.max((post.likeCount ?? 1) - 1, 0);
  //       this.likingPostIds.delete(post.id);
  //     },
  //   });
  // }

  // openComments(post: Post): void {
  //   this.isCommentsOpen = true;
  //   this.activePost = post;
  //   this.newCommentText = '';
  //   this.fetchComments(post.id);
  // }

  // closeComments(): void {
  //   this.isCommentsOpen = false;
  //   this.activePost = null;
  //   this.comments = [];
  //   this.newCommentText = '';
  // }

  // fetchComments(postId: number): void {
  //   this.loadingComments = true;
  //   this.postsService.getComments(postId).subscribe({
  //     next: (data) => {
  //       this.comments = Array.isArray(data) ? data : (data as any);
  //       this.loadingComments = false;
  //     },
  //     error: (err) => {
  //       console.error('Failed to load comments', err);
  //       this.loadingComments = false;
  //     },
  //   });
  // }

  // addComment(): void {
  //   if (!this.activePost) return;

  //   const text = this.newCommentText.trim();
  //   if (!text) return;

  //   const postId = this.activePost.id;

  //   // Optimistic add (temporary comment)
  //   const temp: Comment = {
  //     id: Date.now(),
  //     postId,
  //     text,
  //     username: 'You',
  //     createdAt: new Date().toISOString(),
  //   };
  //   this.comments = [temp, ...this.comments];
  //   this.newCommentText = '';

  //   this.postsService.addComment(postId, text).subscribe({
  //     next: () => {
  //       // safest: refresh from backend so IDs/order match backend
  //       this.fetchComments(postId);
  //       // update comment count
  //       this.activePost!.commentCount = (this.activePost!.commentCount ?? 0) + 1;
  //     },
  //     error: (err) => {
  //       console.error('Add comment failed', err);
  //       // rollback optimistic insert
  //       this.comments = this.comments.filter((c) => c.id !== temp.id);
  //     },
  //   });
  // }

  // trackByPostId(_: number, post: Post) {
  //   return post.id;
  // }

  // trackByCommentId(_: number, c: Comment) {
  //   return c.id;
  // }
}
