package com.mygate.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitors")
public class Visitor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(name = "visitor_type")      private String visitorType;
    private String phone;
    @Column(name = "vehicle_no")        private String vehicleNo;
    private String status = "pending";
    @Column(name = "arrival_time")      private LocalDateTime arrivalTime;
    @Column(name = "resident_id")       private Long residentId;
    @Column(name = "apartment_number")  private String apartmentNumber;  // NEW
    @Column(name = "reason_of_visit")   private String reasonOfVisit;    // NEW

    public Long getId()                  { return id; }
    public void setId(Long id)           { this.id = id; }
    public String getName()              { return name; }
    public void setName(String n)        { this.name = n; }
    public String getVisitorType()       { return visitorType; }
    public void setVisitorType(String t) { this.visitorType = t; }
    public String getPhone()             { return phone; }
    public void setPhone(String p)       { this.phone = p; }
    public String getVehicleNo()         { return vehicleNo; }
    public void setVehicleNo(String v)   { this.vehicleNo = v; }
    public String getStatus()            { return status; }
    public void setStatus(String s)      { this.status = s; }
    public LocalDateTime getArrivalTime()       { return arrivalTime; }
    public void setArrivalTime(LocalDateTime t) { this.arrivalTime = t; }
    public Long getResidentId()                 { return residentId; }
    public void setResidentId(Long id)          { this.residentId = id; }
    public String getApartmentNumber()          { return apartmentNumber; }
    public void setApartmentNumber(String a)    { this.apartmentNumber = a; }
    public String getReasonOfVisit()            { return reasonOfVisit; }
    public void setReasonOfVisit(String r)      { this.reasonOfVisit = r; }
}