import React from "react";
import utils from "common/utils";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import cnames from "classnames";
import Translate from "react-translate-component";
import asset_utils from "../../lib/common/asset_utils";

class MarginPosition extends React.Component {
    static propTypes = {
        debtAsset: ChainTypes.ChainAsset.isRequired,
        collateralAsset: ChainTypes.ChainAsset.isRequired
    };

    _getFeedPrice() {
        if (!this.props) {
            return 1;
        }

        return (
            1 /
            utils.get_asset_price(
                asset_utils
                    .extractRawFeedPrice(this.props.debtAsset)
                    .getIn(["quote", "amount"]),
                this.props.collateralAsset,
                asset_utils
                    .extractRawFeedPrice(this.props.debtAsset)
                    .getIn(["base", "amount"]),
                this.props.debtAsset
            )
        );
    }

    _getCollateralRatio() {
        const co = this.props.object.toJS();
        const c = utils.get_asset_amount(
            co.collateral,
            this.props.collateralAsset
        );
        const d = utils.get_asset_amount(co.debt, this.props.debtAsset);
        return c / (d / this._getFeedPrice());
    }

    render() {
        const cr = this._getCollateralRatio();

        return (
            <li
                className={cnames("stressed-stat", this.props.className)}
                onClick={this.props.onClick}
            >
                <span>
                    <span className="value stat-primary">
                        {utils.format_number(cr, 2)}
                    </span>
                </span>
                <div className="stat-text">
                    <Translate content="header.collateral_ratio" />
                </div>
            </li>
        );
    }
}
MarginPosition = BindToChainState(MarginPosition);

class ExchangeHeaderCollateral extends React.Component {
    static propTypes = {
        object: ChainTypes.ChainObject.isRequired
    };

    render() {
        let {object, account} = this.props;

        let debtAsset = object.getIn(["call_price", "quote", "asset_id"]);
        let collateralAsset = object.getIn(["call_price", "base", "asset_id"]);

        return (
            <MarginPosition
                debtAsset={debtAsset}
                collateralAsset={collateralAsset}
                account={account}
                {...this.props}
            />
        );
    }
}
ExchangeHeaderCollateral = BindToChainState(ExchangeHeaderCollateral);

export default ExchangeHeaderCollateral;
