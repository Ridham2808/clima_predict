// Data Completeness Validator - GATEKEEPER SERVICE
// Ensures NO analysis happens without complete data
// Enterprise-grade validation

/**
 * Field Status Lifecycle:
 * DRAFT → DETAILS_COMPLETE → PHOTOS_COMPLETE → READY_FOR_ANALYSIS → ANALYZING → RESULTS_READY
 */

class DataCompletenessValidator {
    constructor() {
        this.requiredFields = [
            'cropType',
            'sowingDate',
            'fieldArea',
            'irrigationType',
            'zones'
        ];

        this.requiredPhotosPerZone = 3;
        this.photoTypes = ['leaf_closeup', 'whole_plant', 'field_overview'];
    }

    /**
     * MAIN VALIDATION GATE
     * Returns: { isComplete, status, missingItems, canAnalyze }
     */
    validateFieldData(fieldData) {
        const validation = {
            isComplete: false,
            status: 'DRAFT',
            missingItems: [],
            canAnalyze: false,
            errors: [],
            progress: 0
        };

        // Step 1: Check required field details
        const detailsCheck = this.validateFieldDetails(fieldData);
        validation.missingItems.push(...detailsCheck.missing);
        validation.errors.push(...detailsCheck.errors);

        // Step 2: Check photo requirements
        const photosCheck = this.validatePhotos(fieldData.photos || [], fieldData.zones || []);
        validation.missingItems.push(...photosCheck.missing);
        validation.errors.push(...photosCheck.errors);

        // Step 3: Check GPS/location data
        const locationCheck = this.validateLocation(fieldData);
        validation.missingItems.push(...locationCheck.missing);
        validation.errors.push(...locationCheck.errors);

        // Calculate progress
        const totalChecks = this.requiredFields.length + this.requiredPhotosPerZone + 1; // +1 for location
        const completedChecks = totalChecks - validation.missingItems.length;
        validation.progress = Math.round((completedChecks / totalChecks) * 100);

        // Determine status
        if (detailsCheck.isComplete && !photosCheck.isComplete) {
            validation.status = 'DETAILS_COMPLETE';
        } else if (detailsCheck.isComplete && photosCheck.isComplete && !locationCheck.isComplete) {
            validation.status = 'PHOTOS_COMPLETE';
        } else if (detailsCheck.isComplete && photosCheck.isComplete && locationCheck.isComplete) {
            validation.status = 'READY_FOR_ANALYSIS';
            validation.isComplete = true;
            validation.canAnalyze = true;
        }

        return validation;
    }

    /**
     * Validate field details (Step 1)
     */
    validateFieldDetails(fieldData) {
        const missing = [];
        const errors = [];

        this.requiredFields.forEach(field => {
            if (!fieldData[field] || fieldData[field] === '') {
                missing.push({
                    field,
                    message: this.getFieldMessage(field),
                    type: 'required'
                });
            }
        });

        // Validate crop type is from supported list
        const supportedCrops = ['rice', 'wheat', 'cotton', 'tomato'];
        if (fieldData.cropType && !supportedCrops.includes(fieldData.cropType.toLowerCase())) {
            errors.push({
                field: 'cropType',
                message: `Crop type must be one of: ${supportedCrops.join(', ')}`,
                type: 'invalid'
            });
        }

        // Validate sowing date is not in future
        if (fieldData.sowingDate) {
            const sowingDate = new Date(fieldData.sowingDate);
            if (sowingDate > new Date()) {
                errors.push({
                    field: 'sowingDate',
                    message: 'Sowing date cannot be in the future',
                    type: 'invalid'
                });
            }
        }

        // Validate field area is positive
        if (fieldData.fieldArea && fieldData.fieldArea <= 0) {
            errors.push({
                field: 'fieldArea',
                message: 'Field area must be greater than 0',
                type: 'invalid'
            });
        }

        // Validate zones are defined
        if (fieldData.zones && fieldData.zones.length === 0) {
            missing.push({
                field: 'zones',
                message: 'At least one field zone must be defined',
                type: 'required'
            });
        }

        return {
            isComplete: missing.length === 0 && errors.length === 0,
            missing,
            errors
        };
    }

    /**
     * Validate photo requirements (Step 2)
     */
    validatePhotos(photos, zones) {
        const missing = [];
        const errors = [];

        if (zones.length === 0) {
            missing.push({
                field: 'zones',
                message: 'Define zones before uploading photos',
                type: 'prerequisite'
            });
            return { isComplete: false, missing, errors };
        }

        // Check each zone has required photos
        zones.forEach(zone => {
            const zonePhotos = photos.filter(p => p.zoneId === zone.id);

            if (zonePhotos.length < this.requiredPhotosPerZone) {
                missing.push({
                    field: 'photos',
                    message: `Zone "${zone.name}" needs ${this.requiredPhotosPerZone - zonePhotos.length} more photos`,
                    type: 'required',
                    zoneId: zone.id
                });
            }

            // Check photo types
            this.photoTypes.forEach(type => {
                const hasType = zonePhotos.some(p => p.type === type);
                if (!hasType) {
                    missing.push({
                        field: 'photos',
                        message: `Zone "${zone.name}" missing ${type.replace('_', ' ')} photo`,
                        type: 'required',
                        zoneId: zone.id,
                        photoType: type
                    });
                }
            });

            // Validate photo quality
            zonePhotos.forEach(photo => {
                if (photo.isBlurred) {
                    errors.push({
                        field: 'photos',
                        message: `Photo in zone "${zone.name}" is blurred. Please retake.`,
                        type: 'quality',
                        photoId: photo.id
                    });
                }

                if (photo.fileSize > 10 * 1024 * 1024) { // 10MB
                    errors.push({
                        field: 'photos',
                        message: `Photo in zone "${zone.name}" is too large (max 10MB)`,
                        type: 'size',
                        photoId: photo.id
                    });
                }
            });
        });

        return {
            isComplete: missing.length === 0 && errors.length === 0,
            missing,
            errors
        };
    }

    /**
     * Validate location/GPS data (Step 3)
     */
    validateLocation(fieldData) {
        const missing = [];
        const errors = [];

        if (!fieldData.latitude || !fieldData.longitude) {
            missing.push({
                field: 'location',
                message: 'GPS coordinates required for satellite data',
                type: 'required'
            });
        }

        // Validate coordinates are valid
        if (fieldData.latitude) {
            const lat = parseFloat(fieldData.latitude);
            if (lat < -90 || lat > 90) {
                errors.push({
                    field: 'latitude',
                    message: 'Invalid latitude (must be between -90 and 90)',
                    type: 'invalid'
                });
            }
        }

        if (fieldData.longitude) {
            const lon = parseFloat(fieldData.longitude);
            if (lon < -180 || lon > 180) {
                errors.push({
                    field: 'longitude',
                    message: 'Invalid longitude (must be between -180 and 180)',
                    type: 'invalid'
                });
            }
        }

        return {
            isComplete: missing.length === 0 && errors.length === 0,
            missing,
            errors
        };
    }

    /**
     * Get user-friendly field messages
     */
    getFieldMessage(field) {
        const messages = {
            cropType: 'Select your crop type (Rice, Wheat, Cotton, or Tomato)',
            sowingDate: 'Enter the date when crop was sown',
            fieldArea: 'Enter total field area in hectares',
            irrigationType: 'Select irrigation method (Drip, Sprinkler, Flood, Rainfed)',
            zones: 'Define at least one field zone for monitoring'
        };
        return messages[field] || `${field} is required`;
    }

    /**
     * Check if analysis can proceed (CRITICAL GATE)
     */
    canProceedToAnalysis(fieldData) {
        const validation = this.validateFieldData(fieldData);

        if (!validation.canAnalyze) {
            return {
                allowed: false,
                reason: 'Data incomplete',
                status: validation.status,
                missingItems: validation.missingItems,
                progress: validation.progress,
                message: this.getBlockingMessage(validation.status)
            };
        }

        return {
            allowed: true,
            status: 'READY_FOR_ANALYSIS',
            message: 'All requirements met. Analysis can begin.'
        };
    }

    /**
     * Get blocking message for UI
     */
    getBlockingMessage(status) {
        const messages = {
            DRAFT: '📝 Complete field details to proceed',
            DETAILS_COMPLETE: '📸 Upload required photos (min 3 per zone)',
            PHOTOS_COMPLETE: '📍 Add GPS location for satellite data',
            READY_FOR_ANALYSIS: '✅ Ready for analysis'
        };
        return messages[status] || 'Complete all steps to unlock analysis';
    }

    /**
     * Get next action for user
     */
    getNextAction(status) {
        const actions = {
            DRAFT: {
                action: 'complete_details',
                label: 'Complete Field Details',
                icon: '📝',
                priority: 'urgent'
            },
            DETAILS_COMPLETE: {
                action: 'upload_photos',
                label: 'Upload Crop Photos',
                icon: '📸',
                priority: 'urgent'
            },
            PHOTOS_COMPLETE: {
                action: 'add_location',
                label: 'Add GPS Location',
                icon: '📍',
                priority: 'high'
            },
            READY_FOR_ANALYSIS: {
                action: 'start_analysis',
                label: 'Start Analysis',
                icon: '🚀',
                priority: 'ready'
            }
        };
        return actions[status] || actions.DRAFT;
    }
}

// Export singleton
const dataCompletenessValidator = new DataCompletenessValidator();
module.exports = dataCompletenessValidator;
