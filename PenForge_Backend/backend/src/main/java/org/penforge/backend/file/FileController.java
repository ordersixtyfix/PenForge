package org.penforge.backend.file;

import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.penforge.backend.user.User;
import org.penforge.backend.user.UserService;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final GridFsTemplate gridFsTemplate;
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getFileById(@PathVariable String id) {
        GridFSFile file = gridFsTemplate.findOne(new org.springframework.data.mongodb.core.query.Query(org.springframework.data.mongodb.core.query.Criteria.where("_id").is(new ObjectId(id))));

        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        GridFsResource resource = gridFsTemplate.getResource(file);

        try {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(resource.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource.getInputStream().readAllBytes());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error occurred while retrieving file");
        }
    }

    @PutMapping("/update-profile-picture/{userId}")
    public ResponseEntity<?> updateProfilePicture(@PathVariable String userId, @RequestParam("profilePicture") MultipartFile profilePicture) {
        try {
            // Mevcut profil resmini silme
            User user = userService.getUserById(userId);
            if (user.getProfilePictureUrl() != null) {
                gridFsTemplate.delete(new org.springframework.data.mongodb.core.query.Query(org.springframework.data.mongodb.core.query.Criteria.where("_id").is(new ObjectId(user.getProfilePictureUrl()))));
            }

            // Yeni profil resmini kaydetme
            String profilePictureUrl = saveProfilePicture(profilePicture);
            user.setProfilePictureUrl(profilePictureUrl);

            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Profil resmi güncellenirken hata oluştu");
        }
    }

    private String saveProfilePicture(MultipartFile profilePicture) throws IOException {
        ObjectId fileId = gridFsTemplate.store(profilePicture.getInputStream(), profilePicture.getOriginalFilename(), profilePicture.getContentType());
        return fileId.toString();
    }
}
