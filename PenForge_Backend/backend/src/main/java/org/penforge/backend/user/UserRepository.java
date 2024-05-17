package org.penforge.backend.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {


    Optional<User> findByEmail(String email);

    Optional<User> findById(String userId);

    Optional<User> findByPasswordAndEmail(String password,String email);






}
