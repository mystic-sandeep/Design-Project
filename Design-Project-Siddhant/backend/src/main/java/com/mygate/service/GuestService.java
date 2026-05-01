package com.mygate.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.mygate.dto.ApproveGuestRequest;
import com.mygate.dto.GuestResponse;
import com.mygate.entity.Guest;
import com.mygate.entity.Resident;
import com.mygate.repository.GuestRepository;
import com.mygate.repository.ResidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class GuestService {

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private ResidentRepository residentRepository;

    public GuestResponse approveGuest(ApproveGuestRequest request) {

        // ✅ 1. Check duplicate FIRST
        Optional<Guest> existingGuest =
                guestRepository.findByPhoneAndResidentId(request.getPhone(), request.getResidentId());

        if (existingGuest.isPresent()) {
            Guest oldGuest = existingGuest.get();

            GuestResponse response = new GuestResponse();
            response.setSuccess(true);
            response.setGuestId(oldGuest.getId());
            response.setPassCode(oldGuest.getPassCode());
            response.setQrDataUrl(generateQRCode(oldGuest.getPassCode()));
            response.setMessage("Guest already approved");

            return response;
        }

        // ✅ 2. Get or create resident
        Resident resident = residentRepository.findById(request.getResidentId())
                .orElseGet(() -> {
                    Resident newResident = new Resident();
                    newResident.setId(request.getResidentId());
                    newResident.setName("Resident " + request.getResidentId());
                    newResident.setPhone("9999999999");
                    newResident.setFlatNumber("A-" + request.getResidentId());
                    return residentRepository.save(newResident);
                });

        // ✅ 3. Create new guest
        String guestId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String passCode = guestId + "_" + request.getResidentId();

        Guest guest = new Guest();
        guest.setId(guestId);
        guest.setPassCode(passCode);
        guest.setResidentId(request.getResidentId());
        guest.setResidentName(resident.getName());
        guest.setName(request.getName());
        guest.setPhone(request.getPhone());
        guest.setPurpose(request.getPurpose());
        guest.setApprovedAt(LocalDateTime.now());

        // ✅ 4. SAVE guest (you missed this earlier ❗)
        guestRepository.save(guest);

        // ✅ 5. Generate QR
        String qrDataUrl = generateQRCode(passCode);

        // ✅ 6. Response
        GuestResponse response = new GuestResponse();
        response.setSuccess(true);
        response.setGuestId(guestId);
        response.setPassCode(passCode);
        response.setQrDataUrl(qrDataUrl);
        response.setMessage("Guest approved successfully");

        return response;
    }

    public Guest verifyGuest(String passCode) {
        return guestRepository.findByPassCode(passCode)
                .orElseThrow(() -> new RuntimeException("Invalid guest pass: " + passCode));
    }

    private String generateQRCode(String text) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 300, 300);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

            byte[] qrImageBytes = pngOutputStream.toByteArray();
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(qrImageBytes);

        } catch (WriterException | IOException e) {
            throw new RuntimeException("QR generation failed", e);
        }
    }
}