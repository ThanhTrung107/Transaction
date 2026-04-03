package com.example.springboot.service;

import com.example.springboot.dto.RegisterCreationRequest;
import com.example.springboot.entity.Account;
import com.example.springboot.repository.AccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountService {

  private final AccountRepository accountRepository;
  private final PasswordEncoder passwordEncoder;

  public AccountService(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
    this.accountRepository = accountRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public boolean existsByUsername(String username) {
    return accountRepository.existsByUsername(username.toUpperCase());
  }

  public Optional<Account> authenticate(String username, String password) {
    Optional<Account> accountOpt = accountRepository.findByUsername(username.toUpperCase());
    if (accountOpt.isPresent()) {
      Account account = accountOpt.get();
      // So sánh password
      if (passwordEncoder.matches(password, account.getPassword())) {
        return Optional.of(account);
      }
    }
    return Optional.empty();
  }

  public Account register(RegisterCreationRequest request) {
    Account account = new Account();
    account.setUsername(request.getUsername().toUpperCase());
    account.setPassword(passwordEncoder.encode(request.getPassword()));
    account.setRole(request.getRole());

    return accountRepository.save(account);
  }
}
