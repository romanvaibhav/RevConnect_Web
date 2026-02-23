package com.revconnect.RevConnectWeb.services;

import com.revconnect.RevConnectWeb.DTO.ConnectionRequestDTO;
import com.revconnect.RevConnectWeb.DTO.ConnectionsDTO;
import com.revconnect.RevConnectWeb.entity.ConnectionRequest;
import com.revconnect.RevConnectWeb.entity.ConnectionRequestStatus;
import com.revconnect.RevConnectWeb.entity.Connections;
import com.revconnect.RevConnectWeb.entity.User;
import com.revconnect.RevConnectWeb.repository.ConnectionRequestRepository;
import com.revconnect.RevConnectWeb.repository.ConnectionsRepository;
import com.revconnect.RevConnectWeb.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class ConnectionService {
    private final ConnectionRequestRepository requestRepo;
    private final ConnectionsRepository connectionsRepo;
    private final UserRepository userRepo;

    public ConnectionService(ConnectionRequestRepository requestRepo,
                             ConnectionsRepository connectionsRepo,
                             UserRepository userRepo) {
        this.requestRepo = requestRepo;
        this.connectionsRepo = connectionsRepo;
        this.userRepo = userRepo;
    }

    public ConnectionRequestDTO sendRequest(Long senderId, Long receiverId) {
        if (senderId.equals(receiverId)) throw new RuntimeException("Cannot send request to yourself");

        User sender = userRepo.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepo.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (requestRepo.existsBySenderAndReceiver(sender, receiver)) {
            throw new RuntimeException("Connection request already sent");
        }
        if (connectionsRepo.existsByUser1AndUser2(sender, receiver) || connectionsRepo.existsByUser1AndUser2(receiver, sender)) {
            throw new RuntimeException("Already connected");
        }

        ConnectionRequest request = new ConnectionRequest(sender, receiver);
        requestRepo.save(request);
        return mapToDTO(request);
    }

    // Accept connection request
    public ConnectionRequestDTO acceptRequest(Long requestId, Long userId) {
        ConnectionRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getReceiver().getUserId().equals(userId)) {
            throw new RuntimeException("Only the receiver can accept the request");
        }

        request.setStatus(ConnectionRequestStatus.ACCEPTED);

        Connections connection = new Connections(request.getSender(), request.getReceiver());
        connectionsRepo.save(connection);

        return mapToDTO(request);
    }

    // Reject connection request
    public ConnectionRequestDTO rejectRequest(Long requestId, Long userId) {
        ConnectionRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getReceiver().getUserId().equals(userId)) {
            throw new RuntimeException("Only the receiver can reject the request");
        }

        request.setStatus(ConnectionRequestStatus.REJECTED);
        return mapToDTO(request);
    }

    // View pending connection requests (sent and received)
    public List<ConnectionRequestDTO> viewPendingRequests(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<ConnectionRequest> requests = requestRepo.findBySenderOrReceiverAndStatus(user, user, ConnectionRequestStatus.PENDING);
        return requests.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // View all connections of a user
    public List<ConnectionsDTO> viewConnections(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Connections> connections = connectionsRepo.findByUser1OrUser2(user, user);
        return connections.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // Remove a connection
    public void removeConnection(Long userId, Long connectionId) {
        Connections connection = connectionsRepo.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        if (!connection.getUser1().getUserId().equals(userId) && !connection.getUser2().getUserId().equals(userId)) {
            throw new RuntimeException("You can only remove your own connections");
        }

        connectionsRepo.delete(connection);
    }




    //    Mapping DTO's
    private ConnectionRequestDTO mapToDTO(ConnectionRequest request) {
        return new ConnectionRequestDTO(
                request.getRequestId(),
                request.getSender().getUserId(),
                request.getSender().getUsername(),
                request.getReceiver().getUserId(),
                request.getReceiver().getUsername(),
                request.getStatus(),
                request.getCreatedAt(),
                request.getRespondedAt()
        );
    }

    private ConnectionsDTO mapToDTO(Connections connection) {
        return new ConnectionsDTO(
                connection.getId(),
                connection.getUser1().getUserId(),
                connection.getUser1().getUsername(),
                connection.getUser2().getUserId(),
                connection.getUser2().getUsername(),
                connection.getConnectedAt()
        );
    }

}
