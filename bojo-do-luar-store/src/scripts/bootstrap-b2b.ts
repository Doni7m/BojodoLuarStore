import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  createPriceListsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function bootstrapB2B({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const customerModuleService = container.resolve(Modules.CUSTOMER);

  logger.info("Starting B2B bootstrap...");

  // Handle B2C Channel: Rename existing default or create new
  let b2cChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (b2cChannel.length) {
    // Update name to "B2C Channel"
    await salesChannelModuleService.updateSalesChannels(b2cChannel[0].id, {
      name: "B2C Channel",
    });
    logger.info("Renamed existing default channel to B2C Channel");
  } else {
    // Create B2C Channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "B2C Channel",
          },
        ],
      },
    });
    b2cChannel = salesChannelResult;
    logger.info("Created B2C Channel");
  }

  // Create B2B Channel
  const { result: b2bResult } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "B2B Channel",
        },
      ],
    },
  });
  const b2bChannel = b2bResult[0];
  logger.info("Created B2B Channel");

  // Create PAKs for B2C and B2B
  const { result: pakResult } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "B2C Webshop",
          type: "publishable",
          created_by: "",
        },
        {
          title: "B2B Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const b2cPak = pakResult.find((p) => p.title === "B2C Webshop");
  const b2bPak = pakResult.find((p) => p.title === "B2B Webshop");
  logger.info("Created PAKs for B2C and B2B");

  // Link PAKs to channels
  if (b2cPak) {
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: b2cPak.id,
        add: [b2cChannel[0].id],
      },
    });
  } else {
    logger.warn("B2C PAK not found, skipping linking");
  }
  if (b2bPak) {
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: b2bPak.id,
        add: [b2bChannel.id],
      },
    });
  } else {
    logger.warn("B2B PAK not found, skipping linking");
  }
  logger.info("Linked PAKs to respective channels");

  // Create PT Region
  try {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Portugal",
            currency_code: "eur",
            countries: ["pt"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    logger.info("Created PT Region");
  } catch (e) {
    logger.warn("PT region creation failed, possibly already exists: " + e.message);
  }

  // Create B2B Customer Group
  const b2bGroup = await customerModuleService.createCustomerGroups({
    name: "B2B Customers",
  });
  logger.info("Created B2B Customer Group");

  // Create B2B Price List
  const { result: priceListResult } = await createPriceListsWorkflow(container).run({
    input: {
      price_lists_data: [
        {
          title: "B2B Price List",
          description: "Discounted prices for B2B customers",
          type: "sale",
          status: "active",
          starts_at: new Date().toISOString(),
          customer_groups: [{ id: b2bGroup.id }],
        },
      ],
    },
  });
  logger.info("Created B2B Price List");

  logger.info("B2B bootstrap completed successfully");
}
