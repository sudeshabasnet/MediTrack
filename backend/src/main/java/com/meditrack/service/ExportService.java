package com.meditrack.service;

import com.meditrack.entity.Medicine;
import com.meditrack.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {
    private final MedicineRepository medicineRepository;

    public byte[] exportToCsv() throws IOException {
        List<Medicine> medicines = medicineRepository.findAll();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(outputStream);

        // Write CSV header
        writer.println("ID,Name,Category,Generic Name,Manufacturer,Current Stock,Unit Price,Status,Batch Number,Expiry Date,Supplier");

        // Write data
        for (Medicine medicine : medicines) {
            writer.printf("%d,%s,%s,%s,%s,%d,%s,%s,%s,%s,%s%n",
                    medicine.getId(),
                    escapeCsv(medicine.getName()),
                    medicine.getCategory(),
                    escapeCsv(medicine.getGenericName()),
                    escapeCsv(medicine.getManufacturer()),
                    medicine.getCurrentStock(),
                    medicine.getUnitPrice(),
                    medicine.getStatus(),
                    medicine.getBatchNumber(),
                    medicine.getExpiryDate(),
                    escapeCsv(medicine.getSupplier().getOrganizationName()));
        }

        writer.flush();
        writer.close();
        return outputStream.toByteArray();
    }

    public byte[] exportToPdf() throws IOException {
        // Simple PDF implementation - in production, use a library like Apache PDFBox or iText
        List<Medicine> medicines = medicineRepository.findAll();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(outputStream);

        writer.println("MediTrack - Medicine Report");
        writer.println("====================================");
        writer.println();

        for (Medicine medicine : medicines) {
            writer.printf("ID: %d%n", medicine.getId());
            writer.printf("Name: %s%n", medicine.getName());
            writer.printf("Category: %s%n", medicine.getCategory());
            writer.printf("Stock: %d%n", medicine.getCurrentStock());
            writer.printf("Price: %s%n", medicine.getUnitPrice());
            writer.printf("Status: %s%n", medicine.getStatus());
            writer.println("------------------------------------");
        }

        writer.flush();
        writer.close();
        return outputStream.toByteArray();
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}



