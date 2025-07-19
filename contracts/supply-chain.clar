;; Enhanced Supply Chain Tracking Smart Contract with Quality Verification

;; Define data variables
(define-data-var contract-owner principal tx-sender)
(define-data-var next-batch-id uint u1)

;; Define data maps
(define-map items
  { item-id: (string-ascii 32) }
  {
    name: (string-utf8 100),
    description: (string-utf8 500),
    metadata: (string-utf8 1000),
    status: uint,
    creator: principal,
    created-at: uint,
    batch-id: (optional uint),
    quality-verified: bool,
    requires-approval: bool,
    approval-count: uint,
    required-approvals: uint
  }
)

(define-map item-events
  { event-id: (string-ascii 32) }
  {
    item-id: (string-ascii 32),
    status: uint,
    actor: principal,
    notes: (string-utf8 500),
    location: (string-utf8 100),
    timestamp: uint,
    event-type: (string-ascii 20)
  }
)

(define-map quality-verifications
  { verification-id: (string-ascii 32) }
  {
    item-id: (string-ascii 32),
    inspector: principal,
    verified: bool,
    quality-score: uint,
    notes: (string-utf8 500),
    timestamp: uint
  }
)

(define-map approvals
  { approval-id: (string-ascii 32) }
  {
    item-id: (string-ascii 32),
    approver: principal,
    approved: bool,
    notes: (string-utf8 500),
    timestamp: uint
  }
)

(define-map batches
  { batch-id: uint }
  {
    name: (string-utf8 100),
    creator: principal,
    created-at: uint,
    status: uint,
    item-count: uint
  }
)

(define-map user-roles
  { user: principal }
  { role: (string-ascii 20) }
)

;; Define constants for status values
(define-constant STATUS_CREATED u0)
(define-constant STATUS_MANUFACTURING u1)
(define-constant STATUS_MANUFACTURED u2)
(define-constant STATUS_PACKAGING_STARTED u3)
(define-constant STATUS_PACKAGED u4)
(define-constant STATUS_SHIPPING_STARTED u5)
(define-constant STATUS_IN_TRANSIT u6)
(define-constant STATUS_DELIVERED u7)
(define-constant STATUS_RECEIVED_BY_RETAILER u8)
(define-constant STATUS_FOR_SALE u9)
(define-constant STATUS_SOLD u10)
(define-constant STATUS_RECEIVED_BY_CONSUMER u11)

;; Quality verification constants
(define-constant MIN_QUALITY_SCORE u70)
(define-constant MAX_QUALITY_SCORE u100)

;; Role constants
(define-constant ROLE_MANUFACTURER "manufacturer")
(define-constant ROLE_SHIPPER "shipper")
(define-constant ROLE_RETAILER "retailer")
(define-constant ROLE_CONSUMER "consumer")
(define-constant ROLE_INSPECTOR "inspector")
(define-constant ROLE_ADMIN "admin")

;; Error constants
(define-constant ERR_ITEM_EXISTS u100)
(define-constant ERR_ITEM_NOT_FOUND u101)
(define-constant ERR_UNAUTHORIZED u102)
(define-constant ERR_INVALID_STATUS u103)
(define-constant ERR_QUALITY_NOT_VERIFIED u104)
(define-constant ERR_INSUFFICIENT_APPROVALS u105)
(define-constant ERR_INVALID_QUALITY_SCORE u106)
(define-constant ERR_BATCH_NOT_FOUND u107)
(define-constant ERR_INVALID_ROLE u108)

;; Helper functions
(define-private (is-authorized-for-status (status uint))
  (let ((user-role (default-to "" (get role (map-get? user-roles { user: tx-sender })))))
    (or
      (is-eq user-role ROLE_ADMIN)
      (and (or (is-eq status STATUS_CREATED)
               (is-eq status STATUS_MANUFACTURING)
               (is-eq status STATUS_MANUFACTURED)
               (is-eq status STATUS_PACKAGING_STARTED)
               (is-eq status STATUS_PACKAGED))
           (is-eq user-role ROLE_MANUFACTURER))
      (and (or (is-eq status STATUS_SHIPPING_STARTED)
               (is-eq status STATUS_IN_TRANSIT)
               (is-eq status STATUS_DELIVERED))
           (is-eq user-role ROLE_SHIPPER))
      (and (or (is-eq status STATUS_RECEIVED_BY_RETAILER)
               (is-eq status STATUS_FOR_SALE)
               (is-eq status STATUS_SOLD))
           (is-eq user-role ROLE_RETAILER))
      (and (is-eq status STATUS_RECEIVED_BY_CONSUMER)
           (is-eq user-role ROLE_CONSUMER))
    )
  )
)

(define-private (requires-quality-verification (status uint))
  (or (is-eq status STATUS_MANUFACTURED)
      (is-eq status STATUS_PACKAGED)
      (is-eq status STATUS_DELIVERED))
)

(define-private (requires-multi-party-approval (status uint))
  (or (is-eq status STATUS_SHIPPING_STARTED)
      (is-eq status STATUS_FOR_SALE))
)

;; Public functions
(define-public (set-user-role (user principal) (role (string-ascii 20)))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) (err ERR_UNAUTHORIZED))
    (asserts! (or (is-eq role ROLE_MANUFACTURER)
                  (is-eq role ROLE_SHIPPER)
                  (is-eq role ROLE_RETAILER)
                  (is-eq role ROLE_CONSUMER)
                  (is-eq role ROLE_INSPECTOR)
                  (is-eq role ROLE_ADMIN)) (err ERR_INVALID_ROLE))
    (map-set user-roles { user: user } { role: role })
    (ok true)
  )
)

(define-public (create-batch (name (string-utf8 100)))
  (let ((batch-id (var-get next-batch-id)))
    (map-set batches
      { batch-id: batch-id }
      {
        name: name,
        creator: tx-sender,
        created-at: block-height,
        status: STATUS_CREATED,
        item-count: u0
      }
    )
    (var-set next-batch-id (+ batch-id u1))
    (ok batch-id)
  )
)

(define-public (register-item
    (item-id (string-ascii 32))
    (name (string-utf8 100))
    (description (string-utf8 500))
    (metadata (string-utf8 1000))
    (batch-id (optional uint))
  )
  (let
    (
      (event-id (concat item-id "-event-0"))
      (requires-approval (requires-multi-party-approval STATUS_CREATED))
    )
    ;; Check if item already exists
    (asserts! (is-none (map-get? items { item-id: item-id })) (err ERR_ITEM_EXISTS))

    ;; Validate batch if provided
    (match batch-id
      batch-val (asserts! (is-some (map-get? batches { batch-id: batch-val })) (err ERR_BATCH_NOT_FOUND))
      true
    )

    ;; Insert the new item
    (map-set items
      { item-id: item-id }
      {
        name: name,
        description: description,
        metadata: metadata,
        status: STATUS_CREATED,
        creator: tx-sender,
        created-at: block-height,
        batch-id: batch-id,
        quality-verified: false,
        requires-approval: requires-approval,
        approval-count: u0,
        required-approvals: (if requires-approval u2 u0)
      }
    )

    ;; Update batch item count if batch provided
    (match batch-id
      batch-val (let ((batch-data (unwrap! (map-get? batches { batch-id: batch-val }) (err ERR_BATCH_NOT_FOUND))))
                  (map-set batches
                    { batch-id: batch-val }
                    (merge batch-data { item-count: (+ (get item-count batch-data) u1) })))
      true
    )

    ;; Create initial event
    (map-set item-events
      { event-id: event-id }
      {
        item-id: item-id,
        status: STATUS_CREATED,
        actor: tx-sender,
        notes: "Item created",
        location: "",
        timestamp: block-height,
        event-type: "status_update"
      }
    )

    (ok item-id)
  )
)

(define-public (verify-quality
    (item-id (string-ascii 32))
    (quality-score uint)
    (notes (string-utf8 500))
  )
  (let
    (
      (item (unwrap! (map-get? items { item-id: item-id }) (err ERR_ITEM_NOT_FOUND)))
      (verification-id (concat item-id "-quality-" (to-string block-height)))
      (user-role (default-to "" (get role (map-get? user-roles { user: tx-sender }))))
    )
    ;; Check if user is authorized inspector
    (asserts! (or (is-eq user-role ROLE_INSPECTOR) (is-eq user-role ROLE_ADMIN)) (err ERR_UNAUTHORIZED))

    ;; Validate quality score
    (asserts! (and (>= quality-score u0) (<= quality-score MAX_QUALITY_SCORE)) (err ERR_INVALID_QUALITY_SCORE))

    ;; Create quality verification record
    (map-set quality-verifications
      { verification-id: verification-id }
      {
        item-id: item-id,
        inspector: tx-sender,
        verified: (>= quality-score MIN_QUALITY_SCORE),
        quality-score: quality-score,
        notes: notes,
        timestamp: block-height
      }
    )

    ;; Update item quality verification status
    (map-set items
      { item-id: item-id }
      (merge item { quality-verified: (>= quality-score MIN_QUALITY_SCORE) })
    )

    ;; Create event
    (map-set item-events
      { event-id: (concat item-id "-event-" (to-string block-height)) }
      {
        item-id: item-id,
        status: (get status item),
        actor: tx-sender,
        notes: (concat "Quality verification: " notes),
        location: "",
        timestamp: block-height,
        event-type: "quality_check"
      }
    )

    (ok verification-id)
  )
)

(define-public (approve-item
    (item-id (string-ascii 32))
    (notes (string-utf8 500))
  )
  (let
    (
      (item (unwrap! (map-get? items { item-id: item-id }) (err ERR_ITEM_NOT_FOUND)))
      (approval-id (concat item-id "-approval-" (to-string block-height)))
      (current-approvals (get approval-count item))
      (required-approvals (get required-approvals item))
    )
    ;; Check if item requires approval
    (asserts! (get requires-approval item) (err ERR_UNAUTHORIZED))

    ;; Create approval record
    (map-set approvals
      { approval-id: approval-id }
      {
        item-id: item-id,
        approver: tx-sender,
        approved: true,
        notes: notes,
        timestamp: block-height
      }
    )

    ;; Update item approval count
    (map-set items
      { item-id: item-id }
      (merge item { approval-count: (+ current-approvals u1) })
    )

    ;; Create event
    (map-set item-events
      { event-id: (concat item-id "-event-" (to-string block-height)) }
      {
        item-id: item-id,
        status: (get status item),
        actor: tx-sender,
        notes: (concat "Approval: " notes),
        location: "",
        timestamp: block-height,
        event-type: "approval"
      }
    )

    (ok approval-id)
  )
)

(define-public (update-item-status
    (item-id (string-ascii 32))
    (status uint)
    (notes (string-utf8 500))
    (location (string-utf8 100))
  )
  (let
    (
      (item (unwrap! (map-get? items { item-id: item-id }) (err ERR_ITEM_NOT_FOUND)))
      (event-id (concat item-id "-event-" (to-string block-height)))
    )
    ;; Check authorization
    (asserts! (is-authorized-for-status status) (err ERR_UNAUTHORIZED))

    ;; Check quality verification if required
    (if (requires-quality-verification status)
      (asserts! (get quality-verified item) (err ERR_QUALITY_NOT_VERIFIED))
      true
    )

    ;; Check approvals if required
    (if (requires-multi-party-approval status)
      (asserts! (>= (get approval-count item) (get required-approvals item)) (err ERR_INSUFFICIENT_APPROVALS))
      true
    )

    ;; Update item status
    (map-set items
      { item-id: item-id }
      (merge item { status: status })
    )

    ;; Create event
    (map-set item-events
      { event-id: event-id }
      {
        item-id: item-id,
        status: status,
        actor: tx-sender,
        notes: notes,
        location: location,
        timestamp: block-height,
        event-type: "status_update"
      }
    )

    (ok event-id)
  )
)

(define-public (batch-update-status
    (item-ids (list 10 (string-ascii 32)))
    (status uint)
    (notes (string-utf8 500))
    (location (string-utf8 100))
  )
  (let
    (
      (results (map update-single-item-status item-ids))
    )
    (ok results)
  )
)

(define-private (update-single-item-status (item-id (string-ascii 32)))
  (let
    (
      (item (unwrap! (map-get? items { item-id: item-id }) (err ERR_ITEM_NOT_FOUND)))
      (event-id (concat item-id "-batch-" (to-string block-height)))
    )
    ;; This is a simplified version for batch operations
    ;; In a real implementation, you'd pass status, notes, location as parameters
    (map-set item-events
      { event-id: event-id }
      {
        item-id: item-id,
        status: (get status item),
        actor: tx-sender,
        notes: "Batch operation",
        location: "",
        timestamp: block-height,
        event-type: "batch_update"
      }
    )
    (ok item-id)
  )
)

;; Read-only functions
(define-read-only (get-item (item-id (string-ascii 32)))
  (map-get? items { item-id: item-id })
)

(define-read-only (get-item-event (event-id (string-ascii 32)))
  (map-get? item-events { event-id: event-id })
)

(define-read-only (get-quality-verification (verification-id (string-ascii 32)))
  (map-get? quality-verifications { verification-id: verification-id })
)

(define-read-only (get-approval (approval-id (string-ascii 32)))
  (map-get? approvals { approval-id: approval-id })
)

(define-read-only (get-batch (batch-id uint))
  (map-get? batches { batch-id: batch-id })
)

(define-read-only (get-user-role (user principal))
  (map-get? user-roles { user: user })
)

(define-read-only (is-item-quality-verified (item-id (string-ascii 32)))
  (match (map-get? items { item-id: item-id })
    item (get quality-verified item)
    false
  )
)

(define-read-only (get-item-approval-status (item-id (string-ascii 32)))
  (match (map-get? items { item-id: item-id })
    item {
      approval-count: (get approval-count item),
      required-approvals: (get required-approvals item),
      fully-approved: (>= (get approval-count item) (get required-approvals item))
    }
    { approval-count: u0, required-approvals: u0, fully-approved: false }
  )
)