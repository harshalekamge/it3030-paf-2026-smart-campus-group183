package lk.sliit.smartcampus.common.web;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeUnit;

@Service
public class WebCacheService {

    private final ObjectMapper objectMapper;

    public WebCacheService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String buildEtag(Object payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(json.getBytes(StandardCharsets.UTF_8));
            return "\"" + toHex(hash) + "\"";
        } catch (JsonProcessingException | NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Unable to build ETag for response payload", exception);
        }
    }

    public boolean isNotModified(HttpServletRequest request, String etag) {
        String ifNoneMatch = request.getHeader("If-None-Match");
        if (ifNoneMatch == null || ifNoneMatch.isBlank()) {
            return false;
        }

        for (String candidate : ifNoneMatch.split(",")) {
            String normalized = candidate.trim();
            if ("*".equals(normalized) || etag.equals(normalized)) {
                return true;
            }
        }

        return false;
    }

    public CacheControl privateCachePolicy(long maxAgeSeconds) {
        return CacheControl.maxAge(maxAgeSeconds, TimeUnit.SECONDS)
                .cachePrivate()
                .mustRevalidate();
    }

    private String toHex(byte[] value) {
        StringBuilder builder = new StringBuilder(value.length * 2);
        for (byte current : value) {
            builder.append(String.format("%02x", current));
        }
        return builder.toString();
    }
}
