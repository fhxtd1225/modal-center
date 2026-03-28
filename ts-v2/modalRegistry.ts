import GoodsCreate from '~/view-components/goods/GoodsCreate.vue';
import GoodsEdit from '~/view-components/goods/GoodsEdit.vue';
import GoodsDetailHandler from '~/view-components/goods/GoodsDetailHandler.vue';
import CategoryHelper from '~/view-components/goods/CategoryHelper.vue';
import CompanyHelper from '~/view-components/user/CompanyHelper.vue';
import GoodsPoolHelper from '~/view-components/goods/GoodsPoolHelper.vue';
import GoodsPoolItemHelper from '~/view-components/goods/GoodsPoolItemHelper.vue';
import UserPoolRelationHelper from '~/view-components/goods/UserPoolRelationHelper.vue';
import SystemParameterHelper from '~/view-components/config/SystemParameterHelper.vue';
import ShipmentHelper from '~/view-components/stock/ShipmentHelper.vue';
import SalesCollectionHelper from '~/view-components/SalesCollectionHelper.vue';
import SalesStatementHelper from '~/view-components/SalesStatementHelper.vue';
import OrderHelper from '~/view-components/stock/OrderHelper.vue';
import UserHelper from '~/view-components/user/UserHelper.vue';
import UserLevelHelper from '~/view-components/user/UserLevelHelper.vue';
import TestModalB from '~/view-components/test/TestModalB.vue';
import TestModalA from '~/view-components/test/TestModalA.vue';

export const modalRegistry = {
  goodsDetailHandler: { component: GoodsDetailHandler, payload: {} as { html?: string }, result: {} as { html?: string } },
  goodEdit: { component: GoodsEdit, payload: {} as { id?: number }, result: {} as {} },
  goodCreate: { component: GoodsCreate, payload: {} as {}, result: {} as {} },
  categoryHelper: { component: CategoryHelper, payload: {} as { id?: number; pid?: number }, result: {} as {} },
  companyHelper: { component: CompanyHelper, payload: {} as { id?: number }, result: {} as {} },
  userHelper: { component: UserHelper, payload: {} as { id?: number; companyId?: number }, result: {} as {} },
  userLevelHelper: { component: UserLevelHelper, payload: {} as { id?: number }, result: {} as {} },
  orderHelper: { component: OrderHelper, payload: {} as { id?: number; isEdit?: boolean }, result: {} as {} },
  shipmentHelper: { component: ShipmentHelper, payload: {} as { id?: number }, result: {} as {} },
  salesStatementHelper: { component: SalesStatementHelper, payload: {} as { id?: number }, result: {} as {} },
  salesCollectionHelper: {
    component: SalesCollectionHelper,
    payload: {} as { userId?: number | null; collectionId?: number; type: 'create' | 'edit' | 'info' | 'allocate' },
    result: {} as {}
  },
  goodsPoolHelper: { component: GoodsPoolHelper, payload: {} as { id?: number }, result: {} as {} },
  goodsPoolItemHelper: { component: GoodsPoolItemHelper, payload: {} as { id?: number }, result: {} as {} },
  userPoolRelationHelper: {
    component: UserPoolRelationHelper,
    payload: {} as { id?: number; poolId?: number },
    result: {} as {
      user: {
        id: number;
        username: string;
        userLevel: number;
        companyId: string;
        nickname: string;
        mobile: string;
        avatarLocation: number[];
        status: number;
        userId: number;
      }[];
    }
  },
  systemParameterHelper: {
    component: SystemParameterHelper,
    payload: {} as { id?: number | null; type?: 'create' | 'copy' | 'update' },
    result: {} as {}
  }, // 测试弹窗注册
  testModalA: {
    component: TestModalA,
    payload: {} as { depth: number; from: string },
    result: {} as { msg: string }
  },
  testModalB: {
    component: TestModalB,
    payload: {} as { depth: number; from: string },
    result: {} as { text: string }
  }
} as const;
