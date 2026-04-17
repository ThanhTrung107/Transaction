package com.example.springboot.service;

import com.example.springboot.dto.DepartmentTree;
import com.example.springboot.entity.Department;
import com.example.springboot.repository.DepartmentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DepartmentService {
  @Autowired
  private DepartmentRepository departmentRepo;

  //  private StaffRepository staffRepo;
  public List<DepartmentTree> getTree() {
    List<Department> all = departmentRepo.findByStatus("1");

    // Flat list → Map (dùng ID để match với parentId)
    Map<Long, DepartmentTree> map = all.stream().collect(Collectors.toMap(Department::getId, d -> new DepartmentTree(d.getId(), d.getCode(), d.getName(), d.getParentId())));

    List<DepartmentTree> roots = new ArrayList<>();
    map.values().forEach(node -> {
      if (node.getParentId() == null || node.getParentId() == 0 || !map.containsKey(node.getParentId())) {
        roots.add(node);  // node gốc
      } else {
        map.get(node.getParentId()).getChildren().add(node);  // gắn vào cha
      }
    });
    return roots;
  }

  public Department getDepartmentbyID(long id) {
    return departmentRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy phòng ban với ID: " + id));
  }

  @Transactional
  public Department createDepartment(DepartmentTree request) {
    if (departmentRepo.existsByCode(request.getCode())) {
      throw new RuntimeException("Mã phòng ban '" + request.getCode() + "' đã tồn tại");
    }
    if (departmentRepo.existsByName(request.getName())) {
      throw new RuntimeException("Tên phòng ban '" + request.getName() + "' đã tồn tại");
    }

    // Kiểm tra parentId có tồn tại không (nếu có parent)
    if (request.getParentId() != null && request.getParentId() != 0) {
      Department parentDept = departmentRepo.findById(request.getParentId()).orElseThrow(() -> new RuntimeException("Phòng ban cha ID " + request.getParentId() + " không tồn tại"));

      //  Kiểm tra phòng ban cha có hoạt động không
      if (!"1".equals(parentDept.getStatus())) {
        throw new RuntimeException("Không thể gắn vào phòng ban không hoạt động");
      }
    }

    Department department = new Department();
    department.setCode(request.getCode());
    department.setName(request.getName());
    department.setDescription(request.getDescription());
    department.setParentId(request.getParentId());
    department.setStatus("1"); // Mặc định là hoạt động

    return departmentRepo.save(department);
  }

  @Transactional
  public Department updateDepartment(long id, DepartmentTree request) {

    Department department = departmentRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy phòng ban với ID: " + id));

    if (departmentRepo.existsByCodeAndIdNot(request.getCode(), id)) {
      throw new RuntimeException("Mã phòng ban '" + request.getCode() + "' đã được sử dụng bởi phòng ban khác");
    }
    if (departmentRepo.existsByNameAndIdNot(request.getName(), id)) {
      throw new RuntimeException("Tên phòng ban '" + request.getName() + "' đã được sử dụng bởi phòng ban khác");
    }

    // Kiểm tra circular reference
    if (request.getParentId() != null && request.getParentId() != 0) {
      validateCircularReference(id, request.getParentId());
    }

    //Kiểm tra parentId có tồn tại không
    if (request.getParentId() != null && request.getParentId() != 0) {
      Department parentDept = departmentRepo.findById(request.getParentId()).orElseThrow(() -> new RuntimeException("Phòng ban cha ID " + request.getParentId() + " không tồn tại"));

      // Kiểm tra phòng ban cha có hoạt động không
      if (!"1".equals(parentDept.getStatus())) {
        throw new RuntimeException("Không thể gắn vào phòng ban không hoạt động");
      }
    }

    department.setCode(request.getCode());
    department.setName(request.getName());
    department.setParentId(request.getParentId());
    department.setDescription(request.getDescription());

    Department saved = departmentRepo.save(department);

    return saved;
  }


  private void validateCircularReference(long departmentId, long newParentId) {
    Long currentParentId = newParentId;
    int depth = 0;
    int maxDepth = 100; // Tránh vòng lặp vô hạn trong validation

    while (currentParentId != null && currentParentId != 0 && depth < maxDepth) {
      if (currentParentId == departmentId) {
        throw new RuntimeException("Không thể gắn phòng ban vào chính nó hoặc phòng ban con của nó (circular reference)");
      }

      Department parent = departmentRepo.findById(currentParentId).orElse(null);
      currentParentId = parent != null ? parent.getParentId() : null;
      depth++;
    }

    if (depth >= maxDepth) {
      throw new RuntimeException("Cấu trúc phòng ban bị lỗi (độ sâu vượt quá giới hạn)");
    }
  }

  public void deleteDepartment(long id) {
    departmentRepo.deleteById(id);
  }
}
