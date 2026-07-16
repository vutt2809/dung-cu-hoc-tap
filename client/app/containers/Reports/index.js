import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import actions from '../../actions';
import SubPage from '../../components/Manager/SubPage';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

// Custom SVG Chart Component for Interactive Data Visualization
class InteractiveChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoveredIndex: null,
      tooltipX: 0,
      tooltipY: 0
    };
    this.svgRef = React.createRef();
  }

  handleMouseMove = (e) => {
    const { data } = this.props;
    if (!data || data.length === 0 || !this.svgRef.current) return;

    const svg = this.svgRef.current;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Map mouseX to coordinate system (0 to 800)
    const svgWidth = rect.width;
    const xCoord = (mouseX / svgWidth) * 800;

    const paddingLeft = 70;
    const paddingRight = 20;
    const chartWidth = 800 - paddingLeft - paddingRight;

    // Find the closest data index based on X coordinate
    const relativeX = xCoord - paddingLeft;
    const index = Math.round((relativeX / chartWidth) * (data.length - 1));
    
    if (index >= 0 && index < data.length) {
      // Calculate tooltip position (in client pixels)
      const dx = chartWidth / (data.length - 1 || 1);
      const pointX = paddingLeft + index * dx;
      
      const maxRevenue = Math.max(...data.map(d => d.revenue), 1000) || 1000;
      const pointY = 280 - (data[index].revenue / maxRevenue) * 220;

      // Convert coordinate to client offset relative to svg container
      const clientX = (pointX / 800) * rect.width;
      const clientY = (pointY / 320) * rect.height;

      this.setState({
        hoveredIndex: index,
        tooltipX: clientX,
        tooltipY: clientY - 10 // Lift tooltip slightly above point
      });
    }
  };

  handleMouseLeave = () => {
    this.setState({ hoveredIndex: null });
  };

  render() {
    const { data, formatVND } = this.props;
    const { hoveredIndex, tooltipX, tooltipY } = this.state;

    if (!data || data.length === 0) {
      return (
        <div className="chart-placeholder">
          Không có dữ liệu hiển thị biểu đồ
        </div>
      );
    }

    const paddingLeft = 70;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;
    
    const width = 800;
    const height = 320;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const maxRevenue = Math.max(...data.map(d => d.revenue), 1000) || 1000;
    const maxOrders = Math.max(...data.map(d => d.orders), 1) || 1;

    // Build line coordinates
    const points = data.map((item, i) => {
      const x = paddingLeft + (i / (data.length - 1 || 1)) * chartWidth;
      const y = (height - paddingBottom) - (item.revenue / maxRevenue) * chartHeight;
      return { x, y, item, index: i };
    });

    // Create SVG paths
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
      : '';

    // Horizontal grid lines (4 intervals)
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
      const val = maxRevenue * ratio;
      const y = (height - paddingBottom) - ratio * chartHeight;
      return { val, y };
    });

    // X-axis label selection (max 6 labels to avoid overlap)
    const labelStep = Math.max(1, Math.ceil(data.length / 6));
    const xLabels = points.filter((_, i) => i % labelStep === 0 || i === data.length - 1);

    // Get active item details
    const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

    return (
      <div className="svg-chart-container" style={{ position: 'relative' }}>
        <svg
          ref={this.svgRef}
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          onMouseMove={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Beautiful gradient fill for the chart area */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            
            {/* Glowing marker dot filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines & Y Axis labels */}
          {gridLines.map((line, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={line.y}
                x2={width - paddingRight}
                y2={line.y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 10}
                y={line.y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
              >
                {formatVND(line.val, true)}
              </text>
            </g>
          ))}

          {/* Area under the line */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#chartGradient)"
            />
          )}

          {/* The line itself */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* X Axis line */}
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* X Axis labels */}
          {xLabels.map((p, i) => {
            const formattedDate = p.item.date.split('-').slice(1).reverse().join('/'); // DD/MM
            return (
              <text
                key={i}
                x={p.x}
                y={height - paddingBottom + 20}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
              >
                {formattedDate}
              </text>
            );
          })}

          {/* Hover effects */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <g>
              {/* Vertical line guide */}
              <line
                x1={points[hoveredIndex].x}
                y1={paddingTop}
                x2={points[hoveredIndex].x}
                y2={height - paddingBottom}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              
              {/* Glowing point */}
              <circle
                cx={points[hoveredIndex].x}
                cy={points[hoveredIndex].y}
                r="6"
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth="2.5"
                filter="url(#glow)"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip Box */}
        {hoveredIndex !== null && activeItem && (
          <div
            className="chart-tooltip"
            style={{
              position: 'absolute',
              left: `${tooltipX}px`,
              top: `${tooltipY}px`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            <div className="tooltip-date">
              {activeItem.date.split('-').reverse().join('/')}
            </div>
            <div className="tooltip-value">
              <span className="dot revenue-dot"></span>
              Doanh thu: <strong>{formatVND(activeItem.revenue)}</strong>
            </div>
            <div className="tooltip-value">
              <span className="dot orders-dot"></span>
              Đơn hàng: <strong>{activeItem.orders} đơn</strong>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class Reports extends React.PureComponent {
  componentDidMount() {
    this.props.fetchReports();
  }

  handleRangeChange = (range) => {
    this.props.setReportsRange(range);
    // Timeout to ensure state updates before call
    setTimeout(() => {
      this.props.fetchReports();
    }, 0);
  };

  handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    this.props.setReportsCustomDates({ [name]: value });
    
    // Auto-fetch if both dates are set
    setTimeout(() => {
      const { customDates } = this.props;
      if (customDates.startDate && customDates.endDate) {
        this.props.fetchReports();
      }
    }, 0);
  };

  formatVND = (value, compact = false) => {
    if (compact) {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1).replace('.0', '') + 'M';
      }
      if (value >= 1000) {
        return (value / 1000).toFixed(0) + 'K';
      }
      return value + ' ₫';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  formatNumber = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  renderTrend = (change) => {
    if (change > 0) {
      return <span className="trend-badge trend-up"><i className="fa fa-caret-up"></i> +{change}%</span>;
    } else if (change < 0) {
      return <span className="trend-badge trend-down"><i className="fa fa-caret-down"></i> {change}%</span>;
    }
    return <span className="trend-badge trend-neutral">0%</span>;
  };

  render() {
    const { data, isLoading, selectedRange, customDates } = this.props;
    const { summary, sales_by_date, top_products, category_sales, order_statuses } = data;

    const ranges = [
      { key: 'today', name: 'Hôm nay' },
      { key: 'yesterday', name: 'Hôm qua' },
      { key: '7days', name: '7 ngày qua' },
      { key: '30days', name: '30 ngày qua' },
      { key: 'this_month', name: 'Tháng này' },
      { key: 'last_month', name: 'Tháng trước' },
      { key: 'custom', name: 'Tùy chọn' }
    ];

    return (
      <div className="reports-container">
        <SubPage title="Báo cáo thống kê">
          {/* Filters Bar */}
          <div className="filters-bar">
            <div className="range-buttons">
              {ranges.map((r) => (
                <button
                  key={r.key}
                  className={`btn-range ${selectedRange === r.key ? 'active' : ''}`}
                  onClick={() => this.handleRangeChange(r.key)}
                >
                  {r.name}
                </button>
              ))}
            </div>

            {selectedRange === 'custom' && (
              <div className="custom-date-inputs">
                <FormGroup className="mb-0 mr-3">
                  <Label for="startDate" className="mr-2">Từ ngày:</Label>
                  <Input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={customDates.startDate}
                    onChange={this.handleCustomDateChange}
                  />
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label for="endDate" className="mr-2">Đến ngày:</Label>
                  <Input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={customDates.endDate}
                    onChange={this.handleCustomDateChange}
                  />
                </FormGroup>
              </div>
            )}
          </div>

          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <>
              {/* KPI Cards Grid */}
              <Row className="kpi-grid">
                {/* Revenue Card */}
                <Col xs="12" sm="6" lg="4" className="mb-4">
                  <div className="kpi-card card-revenue">
                    <div className="kpi-header">
                      <span className="kpi-title">Tổng doanh thu</span>
                      <span className="kpi-icon-wrapper bg-soft-blue">
                        <i className="fa fa-money text-blue"></i>
                      </span>
                    </div>
                    <div className="kpi-value">{this.formatVND(summary.revenue.current)}</div>
                    <div className="kpi-footer">
                      {this.renderTrend(summary.revenue.change)}
                      <span className="kpi-period">so với kỳ trước</span>
                    </div>
                  </div>
                </Col>

                {/* Orders Card */}
                <Col xs="12" sm="6" lg="4" className="mb-4">
                  <div className="kpi-card card-orders">
                    <div className="kpi-header">
                      <span className="kpi-title">Đơn hàng mới</span>
                      <span className="kpi-icon-wrapper bg-soft-purple">
                        <i className="fa fa-shopping-cart text-purple"></i>
                      </span>
                    </div>
                    <div className="kpi-value">{this.formatNumber(summary.orders.current)}</div>
                    <div className="kpi-footer">
                      {this.renderTrend(summary.orders.change)}
                      <span className="kpi-period">so với kỳ trước</span>
                    </div>
                  </div>
                </Col>

                {/* AOV Card */}
                <Col xs="12" sm="6" lg="4" className="mb-4">
                  <div className="kpi-card card-aov">
                    <div className="kpi-header">
                      <span className="kpi-title">Giá trị TB đơn hàng (AOV)</span>
                      <span className="kpi-icon-wrapper bg-soft-amber">
                        <i className="fa fa-calculator text-amber"></i>
                      </span>
                    </div>
                    <div className="kpi-value">{this.formatVND(summary.aov.current)}</div>
                    <div className="kpi-footer">
                      {this.renderTrend(summary.aov.change)}
                      <span className="kpi-period">so với kỳ trước</span>
                    </div>
                  </div>
                </Col>

                {/* Items Sold Card */}
                <Col xs="12" sm="6" lg="6" className="mb-4">
                  <div className="kpi-card card-items">
                    <div className="kpi-header">
                      <span className="kpi-title">Sản phẩm bán ra</span>
                      <span className="kpi-icon-wrapper bg-soft-indigo">
                        <i className="fa fa-cubes text-indigo"></i>
                      </span>
                    </div>
                    <div className="kpi-value">{this.formatNumber(summary.items_sold.current)}</div>
                    <div className="kpi-footer">
                      {this.renderTrend(summary.items_sold.change)}
                      <span className="kpi-period">so với kỳ trước</span>
                    </div>
                  </div>
                </Col>

                {/* New Customers Card */}
                <Col xs="12" sm="6" lg="6" className="mb-4">
                  <div className="kpi-card card-users">
                    <div className="kpi-header">
                      <span className="kpi-title">Khách hàng đăng ký mới</span>
                      <span className="kpi-icon-wrapper bg-soft-teal">
                        <i className="fa fa-user-plus text-teal"></i>
                      </span>
                    </div>
                    <div className="kpi-value">{this.formatNumber(summary.new_customers.current)}</div>
                    <div className="kpi-footer">
                      {this.renderTrend(summary.new_customers.change)}
                      <span className="kpi-period">so với kỳ trước</span>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Main Chart Section */}
              <Row className="mb-4">
                <Col xs="12">
                  <div className="report-panel main-chart-panel">
                    <div className="panel-header">
                      <h4 className="panel-title">Biến động doanh thu & đơn hàng</h4>
                      <span className="panel-subtitle">Dữ liệu được cập nhật theo thời gian thực</span>
                    </div>
                    <div className="panel-body">
                      <InteractiveChart
                        data={sales_by_date}
                        formatVND={this.formatVND}
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Lower Details Grid */}
              <Row>
                {/* Top Selling Products */}
                <Col xs="12" lg="7" className="mb-4">
                  <div className="report-panel top-products-panel">
                    <div className="panel-header">
                      <h4 className="panel-title">Top 5 sản phẩm bán chạy nhất</h4>
                    </div>
                    <div className="panel-body">
                      {top_products.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table top-products-table">
                            <thead>
                              <tr>
                                <th>Sản phẩm</th>
                                <th className="text-center">Đã bán</th>
                                <th className="text-right">Doanh thu</th>
                              </tr>
                            </thead>
                            <tbody>
                              {top_products.map((item, index) => {
                                const maxSold = Math.max(...top_products.map(p => p.quantity_sold), 1);
                                const percentSold = (item.quantity_sold / maxSold) * 100;
                                return (
                                  <tr key={index}>
                                    <td>
                                      <div className="product-info-cell">
                                        <span className="product-rank">{index + 1}</span>
                                        {item.image_url ? (
                                          <img src={item.image_url} alt={item.product_name} className="product-thumb" />
                                        ) : (
                                          <div className="product-thumb-fallback">
                                            <i className="fa fa-cube"></i>
                                          </div>
                                        )}
                                        <span className="product-name" title={item.product_name}>{item.product_name}</span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="sold-progress-cell">
                                        <span className="sold-count font-weight-bold">{item.quantity_sold}</span>
                                        <div className="progress mini-progress">
                                          <div
                                            className="progress-bar bg-blue"
                                            style={{ width: `${percentSold}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="text-right font-weight-bold">
                                      {this.formatVND(item.revenue)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="no-data-msg">Không có dữ liệu bán hàng trong kỳ</div>
                      )}
                    </div>
                  </div>
                </Col>

                {/* Categories & Order Status */}
                <Col xs="12" lg="5" className="mb-4">
                  {/* Category Breakdown */}
                  <div className="report-panel mb-4">
                    <div className="panel-header">
                      <h4 className="panel-title">Doanh thu theo Danh mục</h4>
                    </div>
                    <div className="panel-body category-list-panel">
                      {category_sales.length > 0 ? (
                        <div className="category-sales-list">
                          {category_sales.map((cat, index) => {
                            const totalCatRevenue = category_sales.reduce((sum, c) => sum + c.revenue, 0) || 1;
                            const share = (cat.revenue / totalCatRevenue) * 100;
                            return (
                              <div key={index} className="category-sales-item">
                                <div className="cat-label">
                                  <span className="cat-name">{cat.name}</span>
                                  <span className="cat-val">{this.formatVND(cat.revenue)} ({cat.quantity_sold} chiếc)</span>
                                </div>
                                <div className="progress mini-progress">
                                  <div
                                    className="progress-bar bg-teal"
                                    style={{ width: `${share}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="no-data-msg">Không có dữ liệu danh mục trong kỳ</div>
                      )}
                    </div>
                  </div>

                  {/* Order Status Distribution */}
                  <div className="report-panel">
                    <div className="panel-header">
                      <h4 className="panel-title font-weight-bold">Trạng thái đơn hàng</h4>
                    </div>
                    <div className="panel-body status-list-panel">
                      {order_statuses.length > 0 ? (
                        <div className="status-grid">
                          {order_statuses.map((status, index) => {
                            // Map status strings to styling classes
                            let badgeClass = 'status-default';
                            let statusText = status.status;
                            if (status.status.toLowerCase() === 'completed') {
                              badgeClass = 'status-completed';
                              statusText = 'Hoàn thành';
                            } else if (status.status.toLowerCase() === 'pending') {
                              badgeClass = 'status-pending';
                              statusText = 'Đang chờ';
                            } else if (status.status.toLowerCase() === 'processing') {
                              badgeClass = 'status-processing';
                              statusText = 'Đang xử lý';
                            } else if (status.status.toLowerCase() === 'cancelled') {
                              badgeClass = 'status-cancelled';
                              statusText = 'Đã hủy';
                            }
                            return (
                              <div key={index} className={`status-item-card ${badgeClass}`}>
                                <div className="status-badge-title">{statusText}</div>
                                <div className="status-stats">
                                  <span className="status-count">{status.count} đơn</span>
                                  <span className="status-rev">{this.formatVND(status.revenue)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="no-data-msg">Không có đơn hàng phát sinh trong kỳ</div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </SubPage>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.reports.data,
    isLoading: state.reports.isLoading,
    selectedRange: state.reports.selectedRange,
    customDates: state.reports.customDates
  };
};

export default connect(mapStateToProps, actions)(Reports);
