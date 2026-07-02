package com.thrivewithtianna.coach;

import com.thrivewithtianna.dashboard.DashboardResponse;
import com.thrivewithtianna.users.UserProfileResponse;

/**
 * Full coach view of a single client: profile, current dashboard snapshot,
 * and how many of their messages are still unread by the coach.
 */
public record ClientDetailResponse(
        UserProfileResponse profile,
        DashboardResponse dashboard,
        long unreadFromClient) {
}
