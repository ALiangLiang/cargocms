ALTER TABLE Users add `postCode` varchar(10) DEFAULT NULL;
ALTER TABLE Users add `city` varchar(128) DEFAULT NULL;
ALTER TABLE Users add `district` varchar(128) DEFAULT NULL;

ALTER TABLE Messages MODIFY COLUMN type enum('greeting','orderConfirm','paymentConfirm','deliveryConfirm', 'forgotPassword');

ALTER TABLE `Orders` ADD (
  `tax` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `totalIncludeTax` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `shippingEmail` varchar(128) DEFAULT NULL,
  `shippingTelephone` varchar(32) DEFAULT NULL,
);

ALTER TABLE `SupplierShipOrders` ADD (
  `tax` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `totalIncludeTax` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `shippingEmail` varchar(128) DEFAULT NULL
  `shippingTelephone` varchar(32) DEFAULT NULL,
);