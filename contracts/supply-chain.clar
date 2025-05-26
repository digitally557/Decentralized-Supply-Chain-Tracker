;; Supply Chain Tracking Smart Contract

;; Define data variables
(define-data-var contract-owner principal tx-sender)

;; Define data maps
(define-map items
  { item-id: (string-ascii 32) }
  {
    name: (string-utf8 100),
    description: (string-utf8 500),
    metadata: (string-utf8 1000),
    status: uint,
    creator: principal,
    created-at: uint
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
    timestamp: uint
  }
)

;; Define constants for status values
(define-constant STATUS_CREATED 0)
(define-constant STATUS_MANUFACTURED 1)
(define-constant STATUS_SHIPPED 2)
(define-constant STATUS_IN_TRANSIT 3)
(define-constant STATUS_DELIVERED 4)
(define-constant STATUS_FOR_SALE 5)
(define-constant STATUS_SOLD 6)
(define-constant STATUS_RECEIVED_BY_CONSUMER 7)

;; Define public functions
(define-public (register-item 
    (item-id (string-ascii 32))
    (name (string-utf8 100))
    (description (string-utf8 500))
    (metadata (string-utf8 1000))
    (status uint)
  )
  (let
    (
      (event-id (concat item-id "-event-0"))
    )
    ;; Check if item already exists
    (asserts! (is-none (map-get? items { item-id: item-id })) (err u100))
    
    ;; Insert the new item
    (map-set items
      { item-id: item-id }
      {
        name: name,
        description: description,
        metadata: metadata,
        status: status,
        creator: tx-sender,
        created-at: block-height
      }
    )
    
    ;; Create initial event
    (map-set item-events
      { event-id: event-id }
      {
        item-id: item-id,
        status: status,
        actor: tx-sender,
        notes: "Item created",
        location: "",
        timestamp: block-height
      }
    )
    
    (ok item-id)
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
      (item (unwrap! (map-get? items { item-id: item-id }) (err u101)))
      (event-id (concat item-id "-event-" (to-string block-height)))
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
        timestamp: block-height
      }
    )
    
    (ok event-id)
  )
)

;; Read-only functions
(define-read-only (get-item (item-id (string-ascii 32)))
  (map-get? items { item-id: item-id })
)

(define-read-only (get-item-event (event-id (string-ascii 32)))
  (map-get? item-events { event-id: event-id })
)