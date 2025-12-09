package com.cook_iq.auth.controller;

import com.cook_iq.auth.dto.LoginRequest;
import com.cook_iq.auth.dto.LoginResponse;
import com.cook_iq.auth.dto.RegisterRequest;
import com.cook_iq.auth.dto.UpdateProfileRequest;
import com.cook_iq.auth.model.User;
import com.cook_iq.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Đăng ký user
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    // Lấy thông tin user hiện tại theo userId (có thể lấy từ JWT)
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable String userId) {
        User user = authService.getCurrentUser(userId);
        return ResponseEntity.ok(user);
    }

    // Cập nhật thông tin user
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable String userId,
            @RequestBody User updatedUser
    ) {
        User user = authService.getCurrentUser(userId);
        user.setFullName(updatedUser.getFullName() != null ? updatedUser.getFullName() : user.getFullName());
        user.setEmail(updatedUser.getEmail() != null ? updatedUser.getEmail() : user.getEmail());
        authService.getUserRepository().save(user);
        return ResponseEntity.ok(user);
    }

    // Xoá user (chỉ admin)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        authService.getUserRepository().deleteById(userId);
        return ResponseEntity.ok("Xoá user thành công");
    }

    // Lấy danh sách tất cả user (chỉ admin)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = authService.getUserRepository().findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/profile/update") // API mới
    public ResponseEntity<User> updateProfile(@RequestHeader("Authorization") String token,
                                              @RequestBody UpdateProfileRequest req) {
        // Trích xuất userId từ token hoặc dùng SecurityContext
        // Ở đây giả sử bạn gửi userId kèm theo hoặc lấy từ context.
        // Cách đơn giản nhất nếu bạn đã có filter:

        // String username = jwtService.extractUsername(token.substring(7));
        // User user = authService.getUserRepository().findByEmail(username).get();

        // TUY NHIÊN, để đơn giản cho frontend gọi, ta có thể nhận userId từ token ở tầng service hoặc SecurityContextHolder
        // Nhưng ở AuthController bạn đã có endpoint update user theo ID, ta dùng lại hoặc viết mới.

        // Cách lấy User hiện tại đang login chuẩn nhất:
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName(); // Đây là email
        User currentUser = authService.getUserRepository().findByEmail(currentPrincipalName).get();

        return ResponseEntity.ok(authService.updateProfile(currentUser.getId(), req));
    }

//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final AuthenticationManager authenticationManager;
//    private final JwtService jwtService;
//
//    // Inject thông tin admin từ file properties
//    @Value("${quiz.admin.email}")
//    private String adminEmail;
//    @Value("${quiz.admin.password}")
//    private String adminPassword;
//
//    @Autowired
//    public AuthController(UserRepository userRepository,
//                          PasswordEncoder passwordEncoder,
//                          AuthenticationManager authenticationManager,
//                          JwtService jwtService) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.authenticationManager = authenticationManager;
//        this.jwtService = jwtService;
//    }
//
//    /**
//     * API ĐĂNG KÝ cho tài khoản Người dùng.
//     */
//    @PostMapping("/user/register")
//    public ResponseEntity<ApiResponse> registerStudent(@RequestBody RegisterRequest request) {
//        try {
//            // 1. Kiểm tra dữ liệu đầu vào (uniqueness)
//            if (userRepository.existsByEmail(request.getEmail())) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                        .body(ApiResponse.fail("Lỗi: Email đã được sử dụng!"));
//            }
//
//            // 2. Tạo đối tượng User mới
//            User user = new User();
//            user.setFullName(request.getFullName());
//            user.setEmail(request.getEmail());
//            // Mã hóa mật khẩu
//            user.setPassword(passwordEncoder.encode(request.getPassword()));
//            // Thiết lập các giá trị mặc định
//            user.setRole(Role.USER); // Gán vai trò là người dùng
//            user.setCreatedAt(new Date());
//
//            // 3. Lưu vào cơ sở dữ liệu
//            User newUser =     userRepository.save(user);
//
//            return ResponseEntity.status(HttpStatus.CREATED)
//                    .body(ApiResponse.success("Đăng ký tài khoản sinh viên thành công", newUser));
//
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(ApiResponse.fail("Có lỗi xảy ra trong quá trình đăng ký: " + e.getMessage()));
//        }
//    }
//
//    /**
//     * API ĐĂNG NHẬP cho tài khoản Admin.
//     * Xác thực dựa trên thông tin cấu hình, không dùng DB.
//     */
//    @PostMapping("/admin/login")
//    public ResponseEntity<ApiResponse> loginAdmin(@RequestBody LoginRequest request) {
//        // Bước 1: So sánh thông tin đăng nhập với giá trị đã cấu hình.
//        // Đây là bước xác thực DUY NHẤT cho admin.
//        if (adminEmail.equals(request.getEmail()) && adminPassword.equals(request.getPassword())) {
//
//            // Bước 2: Tạo token trực tiếp.
//            // KHÔNG gọi authenticationManager.authenticate()
//            // KHÔNG gọi userRepository.findByEmail()
//            // Chúng ta cần một phương thức trong JwtService có thể tạo token từ thông tin cơ bản.
//            // Ví dụ: createToken(String userId, List<String> roles)
//            String token = jwtService.createToken("admin", List.of("ROLE_ADMIN"));
//
//            // Bước 3: Tạo một đối tượng User "ảo" để trả về trong response cho nhất quán.
//            User adminUser = new User();
//            adminUser.setId("admin");
//            adminUser.setFullName("Administrator");
//            adminUser.setEmail(adminEmail);
//            adminUser.setRole(Role.ADMIN);
//            // Bước 4: Xây dựng và trả về response thành công.
//            AuthResponse authResponse = new AuthResponse(token, adminUser);
//            return ResponseEntity.ok(ApiResponse.success("Đăng nhập admin thành công", authResponse));
//
//        } else {
//            // Nếu thông tin không khớp, trả về lỗi.
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(ApiResponse.fail("Sai tài khoản hoặc mật khẩu"));
//        }
//    }
//
//    /**
//     * API ĐĂNG NHẬP cho tài khoản Người dùng.
//     * Xác thực bằng email và password đã đăng ký.
//     */
//    @PostMapping("/user/login")
//    public ResponseEntity<ApiResponse> loginStudent(@RequestBody LoginRequest request) {
//        try {
//            // 1. Spring Security xử lý việc xác thực
//            Authentication auth = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
//            );
//
//            // 2. Nếu xác thực thành công, lấy thông tin user từ DB
//            User user = userRepository.findByEmail(request.getEmail())
//                    .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại."));
//
//            // 3. Tạo token
////            String token = jwtService.generateToken(user.getId(), user.getRole().name()); // Giả sử generateToken nhận userId và role
//            UserDetails userDetails = (UserDetails) auth.getPrincipal();
//            String token = jwtService.generateToken(userDetails);
//
//            // 4. Xây dựng response
//            AuthResponse authResponse = new AuthResponse(token, user);
//            return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", authResponse));
//
//        } catch (Exception e) {
//            // Nếu authenticationManager ném ra lỗi (sai pass, user không tồn tại)
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(ApiResponse.fail("Sai tài khoản hoặc mật khẩu"));
//        }
//    }
}
