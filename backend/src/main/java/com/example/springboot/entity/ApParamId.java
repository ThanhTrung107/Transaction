package com.example.springboot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

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
