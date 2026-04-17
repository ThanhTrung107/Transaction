package com.example.springboot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "AP_PARAM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApParam {

  @EmbeddedId
  private ApParamId id;

  @Column(name = "PAR_NAME", nullable = false, length = 200)
  private String parName;

  @Column(name = "DESCRIPTION")
  private String description;

}
