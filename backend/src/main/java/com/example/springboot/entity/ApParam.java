package com.example.springboot.entity;

import jakarta.persistence.*;
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
