package com.campusmart.api;

import com.campusmart.api.dto.AdminListingSummary;
import com.campusmart.api.dto.ModerationActionRequest;
import com.campusmart.api.dto.ModerationActionResponse;
import com.campusmart.api.dto.ModerationHistoryEntry;
import com.campusmart.config.SecurityConfig;
import com.campusmart.model.entity.User;
import com.campusmart.model.enums.ListingStatus;
import com.campusmart.model.enums.UserRole;
import com.campusmart.repository.UserRepository;
import com.campusmart.security.jwt.JwtAuthenticationEntryPoint;
import com.campusmart.security.jwt.JwtAuthenticationFilter;
import com.campusmart.service.ListingModerationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ListingModerationController.class)
@Import({SecurityConfig.class, JwtAuthenticationEntryPoint.class})
class ListingModerationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ListingModerationService moderationService;

    @MockBean
    private UserRepository userRepository;

    @org.springframework.boot.test.context.TestConfiguration
    static class TestConfig {
        @org.springframework.context.annotation.Bean
        public JwtAuthenticationFilter jwtAuthenticationFilter() {
            return new JwtAuthenticationFilter(null, null) {
                @Override
                protected void doFilterInternal(jakarta.servlet.http.HttpServletRequest request,
                                                jakarta.servlet.http.HttpServletResponse response,
                                                jakarta.servlet.FilterChain filterChain)
                        throws jakarta.servlet.ServletException, java.io.IOException {
                    filterChain.doFilter(request, response);
                }
            };
        }
    }

    private UUID adminId;
    private User adminUser;
    private UUID listingId;
    private AdminListingSummary listingSummary;

    @BeforeEach
    void setUp() {
        adminId = UUID.randomUUID();
        adminUser = new User();
        adminUser.setId(adminId);
        adminUser.setEmail("admin@campusmart.edu");
        adminUser.setRole(UserRole.ADMIN);

        listingId = UUID.randomUUID();
        listingSummary = new AdminListingSummary();
        listingSummary.setId(listingId);
        listingSummary.setTitle("Calculus Textbook");
        listingSummary.setPrice(new BigDecimal("450.00"));
        listingSummary.setCurrencyCode("INR");
        listingSummary.setStatus(ListingStatus.ACTIVE.name());
        listingSummary.setCondition("LIKE_NEW");
        listingSummary.setSellerId(UUID.randomUUID());
        listingSummary.setSellerEmail("seller@campusmart.edu");
        listingSummary.setInstitutionId(UUID.randomUUID());
        listingSummary.setCategoryId(UUID.randomUUID());
        listingSummary.setDeleted(false);
        listingSummary.setCreatedAt(Instant.now());
    }

    @Test
    @WithMockUser(username = "admin@campusmart.edu", authorities = {"ROLE_ADMIN"})
    void searchListings_asAdmin_returnsOk() throws Exception {
        when(moderationService.searchListings(eq(null), eq(null), any()))
                .thenReturn(new PageImpl<>(List.of(listingSummary), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/v1/admin/listings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(listingId.toString()))
                .andExpect(jsonPath("$.content[0].title").value("Calculus Textbook"))
                .andExpect(jsonPath("$.content[0].status").value("ACTIVE"));
    }

    @Test
    @WithMockUser(username = "student@campusmart.edu", authorities = {"ROLE_USER"})
    void searchListings_asRegularUser_isForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/admin/listings"))
                .andExpect(status().isForbidden());
    }

    @Test
    void searchListings_unauthenticated_isUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/admin/listings"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "admin@campusmart.edu", authorities = {"ROLE_ADMIN"})
    void getListingById_asAdmin_returnsListing() throws Exception {
        when(moderationService.getListingById(listingId)).thenReturn(listingSummary);

        mockMvc.perform(get("/api/v1/admin/listings/{id}", listingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(listingId.toString()))
                .andExpect(jsonPath("$.title").value("Calculus Textbook"));
    }

    @Test
    @WithMockUser(username = "student@campusmart.edu", authorities = {"ROLE_USER"})
    void getListingById_asRegularUser_isForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/admin/listings/{id}", listingId))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@campusmart.edu", authorities = {"ROLE_ADMIN"})
    void moderateListing_asAdmin_succeeds() throws Exception {
        when(userRepository.findByEmail("admin@campusmart.edu")).thenReturn(Optional.of(adminUser));

        ModerationActionResponse response = new ModerationActionResponse(
                listingId, "ACTIVE", "DEACTIVATED", adminId, "Prohibited item", Instant.now()
        );
        when(moderationService.moderate(eq(listingId), any(ModerationActionRequest.class), eq(adminId)))
                .thenReturn(response);

        ModerationActionRequest request = new ModerationActionRequest(ListingStatus.DEACTIVATED, "Prohibited item");

        mockMvc.perform(patch("/api/v1/admin/listings/{id}/moderate", listingId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.listingId").value(listingId.toString()))
                .andExpect(jsonPath("$.oldStatus").value("ACTIVE"))
                .andExpect(jsonPath("$.newStatus").value("DEACTIVATED"))
                .andExpect(jsonPath("$.reason").value("Prohibited item"));
    }

    @Test
    @WithMockUser(username = "admin@campusmart.edu", authorities = {"ROLE_ADMIN"})
    void moderateListing_blankReason_returnsBadRequest() throws Exception {
        ModerationActionRequest request = new ModerationActionRequest(ListingStatus.DEACTIVATED, "   ");

        mockMvc.perform(patch("/api/v1/admin/listings/{id}/moderate", listingId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "student@campusmart.edu", authorities = {"ROLE_USER"})
    void moderateListing_asRegularUser_isForbidden() throws Exception {
        ModerationActionRequest request = new ModerationActionRequest(ListingStatus.DEACTIVATED, "Prohibited item");

        mockMvc.perform(patch("/api/v1/admin/listings/{id}/moderate", listingId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@campusmart.edu", authorities = {"ROLE_ADMIN"})
    void getHistory_asAdmin_returnsHistoryPage() throws Exception {
        ModerationHistoryEntry entry = new ModerationHistoryEntry();
        entry.setId(UUID.randomUUID());
        entry.setListingId(listingId);
        entry.setListingTitle("Calculus Textbook");
        entry.setAdminId(adminId);
        entry.setAdminEmail("admin@campusmart.edu");
        entry.setPreviousStatus("ACTIVE");
        entry.setNewStatus("DEACTIVATED");
        entry.setReason("Suspicious content");
        entry.setActionAt(Instant.now());

        when(moderationService.getHistoryForListing(eq(listingId), any()))
                .thenReturn(new PageImpl<>(List.of(entry), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/v1/admin/listings/{id}/history", listingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].listingId").value(listingId.toString()))
                .andExpect(jsonPath("$.content[0].previousStatus").value("ACTIVE"))
                .andExpect(jsonPath("$.content[0].newStatus").value("DEACTIVATED"))
                .andExpect(jsonPath("$.content[0].reason").value("Suspicious content"));
    }
}
