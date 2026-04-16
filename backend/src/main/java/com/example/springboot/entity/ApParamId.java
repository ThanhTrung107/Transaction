package com.example.springboot.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ApParamId implements Serializable {

  @Column(name = "PAR_TYPE", nullable = false, length = 50)
  private String parType;

  @Column(name = "PAR_VALUE", nullable = false, length = 50)
  private String parValue;
}
