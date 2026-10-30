# PashuSuraksha — Data Sources & Lineage Documentation

This document records the official sources, methodology, and download dates for reference datasets utilized across the PashuSuraksha application.

---

## 1. Geographic Administrative Hierarchy (`data/locations.csv`)

- **Official Source**: Local Government Directory (LGD), Ministry of Panchayati Raj, Government of India.
- **Source Portal**: [https://lgdirectory.gov.in/](https://lgdirectory.gov.in/)
- **Download & Verification Date**: 2026-09-28
- **Coverage**:
  - All 28 States and 8 Union Territories of India.
  - Official district administrative boundaries.
  - Sub-district (Taluka / Mandal) administrative divisions for primary implementation states (Maharashtra and Andhra Pradesh).
  - Unknown / non-standardized talukas are deliberately left blank in accordance with data provenance standards (no invented or speculative administrative entities).
- **Default Hierarchy Priority**:
  1. **Maharashtra** (Default Primary State)
  2. **Andhra Pradesh** (Secondary Priority State)
  3. All remaining Indian States & Union Territories (ordered alphabetically).

---

## 2. 20th All India Livestock Census Dataset

- **Official Source**: Ministry of Fisheries, Animal Husbandry & Dairying (DAHD), Government of India via Open Government Data (OGD) Platform.
- **Source Portal**: [https://data.gov.in/](https://data.gov.in/) / Department of Animal Husbandry & Dairying
- **Reference Date**: 20th All India Livestock Census (Reference Year 2019-2024 projections)
- **Parameters Sourced**:
  - Cattle, Buffalo, Sheep, Goat district-wise headcounts.
  - Bovine population density and crossbred vs. indigenous ratios for Maharashtra and Andhra Pradesh.

---

## 3. Verified Veterinary Infrastructure Directory (`data/vets_verified.csv`)

- **Official Source**: Veterinary Council of India (VCI) Registration Registry & State Animal Husbandry Department Polyclinic Listings (Maharashtra State Animal Husbandry Department, Pune & Andhra Pradesh Animal Husbandry Department).
- **Compilation Date**: 2026-09-27
- **Verification Rule**: Only districts with officially verified physical clinics and registered veterinary practitioners display operational contact channels. All unverified districts display a standardized `"Directory coming soon"` advisory with 1962 helpline escalation without exposing unverified phone contacts.

---

## 4. Benchmark Veterinary Case Evaluation Suite (`data/test_cases.csv`)

- **Official Source**: Published clinical veterinary records, ICAR disease bulletins, and standard veterinary clinical diagnostic textbooks (Blood & Radostits Veterinary Medicine, ICAR-NIVEDI Annual Disease Forewarning Bulletins).
- **Compilation Date**: 2026-09-28
- **Count**: 50 ground-truth clinical cases across 6 target bovine/ruminant disease syndromes.
- **Simulated / Benchmark Tagging**: All non-live historical benchmark incidents are stamped with `is_simulated: true` for scientific transparency.
