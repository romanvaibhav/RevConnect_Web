import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Networkservice } from '../../cors/networkService/networkservice';
import { Profileservice } from '../../cors/profileService/profileservice';

type ModalType = 'connections' | 'following' | 'pending';

@Component({
  selector: 'app-networks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './networks.html',
  styleUrl: './networks.css',
})
export class Networks implements OnInit {
  constructor(
    private networkService: Networkservice,
    private profileService: Profileservice,
  ) {}

  // data
  connections: any[] = [];
  followings: any[] = [];
  pendingRequests: any[] = [];
  searchResults: any[] = [];

  // ui state
  isModalOpen = false;
  modalType: ModalType = 'connections';
  searchTerm = '';
  loading = false;

  ngOnInit(): void {
    this.getUserConnections();
    this.getAllFollowing();
    this.getAllPendingReq();
    // NOTE: removed auto-searchAllUsers() from ngOnInit,
    // because user will search from UI
  }

  // ---------- API Calls ----------
  getUserConnections(): void {
    this.networkService.getAllConnection().subscribe({
      next: (data: any) => {
        this.connections = Array.isArray(data) ? data : [];
        console.log('User Connections Data:', data);
      },
      error: (err: any) => console.error('Failed to load connections', err),
    });
  }

  getAllFollowing(): void {
    this.networkService.getFollowingByUser().subscribe({
      next: (data: any) => {
        this.followings = Array.isArray(data) ? data : [];
        console.log('User Following Data:', data);
      },
      error: (err: any) => console.error('Failed to load following', err),
    });
  }

  getAllPendingReq(): void {
    this.networkService.getAllPendingRequests().subscribe({
      next: (data: any) => {
        this.pendingRequests = Array.isArray(data) ? data : [];
        console.log('User Pending Requests Data:', data);
      },
      error: (err: any) => console.error('Failed to load pending requests', err),
    });
  }

  // ---------- Modal ----------
  openModal(type: ModalType) {
    this.modalType = type;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // ---------- Search ----------
  onSearch() {
    const q = this.searchTerm.trim();
    if (!q) return;

    this.loading = true;
    this.profileService.searchUserProfiles(q).subscribe({
      next: (data: any) => {
        this.searchResults = Array.isArray(data) ? data : [];
        this.loading = false;
        console.log('Search Results:', data);
      },
      error: (err: any) => {
        console.error('Failed to search users', err);
        this.loading = false;
      },
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchResults = [];
  }

  // ---------- Actions (Connect / Following / Pending) ----------
  // NOTE: Replace these calls with your actual service methods.
  // If your endpoints are different, paste your networkservice methods,
  // I will map these perfectly.

  removeConnection(otherUserId: number) {
    console.log('Remove connection:', otherUserId);

    // Example (if you have): this.networkService.removeConnection(otherUserId)
    // this.networkService.removeConnection(otherUserId).subscribe({
    //   next: () => this.getUserConnections(),
    //   error: (err: any) => console.error('removeConnection failed', err),
    // });

    // Temporary UI remove:
    this.connections = this.connections.filter((c) => this.pickUserId(c) !== otherUserId);
  }

  unfollow(otherUserId: number) {
    console.log('Unfollow:', otherUserId);

    // Example:
    // this.networkService.unfollow(otherUserId).subscribe({
    //   next: () => this.getAllFollowing(),
    //   error: (err: any) => console.error('unfollow failed', err),
    // });

    this.followings = this.followings.filter((f) => this.pickUserId(f) !== otherUserId);
  }

  acceptRequest(requestId: number) {
    console.log('Accept request:', requestId);

    // Example:
    // this.networkService.acceptRequest(requestId).subscribe({
    //   next: () => this.getAllPendingReq(),
    //   error: (err: any) => console.error('acceptRequest failed', err),
    // });

    this.pendingRequests = this.pendingRequests.filter((r) => this.pickRequestId(r) !== requestId);
  }

  rejectRequest(requestId: number) {
    console.log('Reject request:', requestId);

    // Example:
    // this.networkService.rejectRequest(requestId).subscribe({
    //   next: () => this.getAllPendingReq(),
    //   error: (err: any) => console.error('rejectRequest failed', err),
    // });

    this.pendingRequests = this.pendingRequests.filter((r) => this.pickRequestId(r) !== requestId);
  }

  viewProfile(userId: number) {
    console.log('View profile:', userId);
    // add routing if you want:
    // this.router.navigate(['/profile', userId]);
  }

  // ---------- Helpers to support different backend keys ----------
  // Your backend might return userId, id, targetUserId, etc.
  pickUserId(obj: any): number {
    return (
      obj?.userId ?? obj?.id ?? obj?.targetUserId ?? obj?.otherUserId ?? obj?.profileUserId ?? 0
    );
  }

  pickRequestId(obj: any): number {
    return obj?.requestId ?? obj?.id ?? obj?.connectionRequestId ?? 0;
  }

  initials(name: string) {
    if (!name) return 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
