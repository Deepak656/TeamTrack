package com.learnfullstack.employeems.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageStorageService {

    private final String uploadDir = "/your/path/to/images/";

    public String storeImage(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + filename);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        return "/images/" + filename; // URL to be served later
    }
}
