"use client";
import { Card, Spinner } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useTranslations } from 'next-intl';
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { 
  HiShoppingCart, 
  HiCheckCircle, 
  HiClock, 
  HiTruck,
  HiCube,
  HiCheck,
  HiX,
  HiUsers
} from "react-icons/hi";
import { getStatistics } from "@/utils/actions/dashboard/actions";

export default function Home() {
  const { data: session, status } = useSession();
  const t = useTranslations('HomePage');
  const currentLocale = useLocale();

  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (session?.user?.token) {
        try {
          setLoading(true);
          const data = await getStatistics(session?.user?.token);
          
          // Transform API response to match component structure
          const transformedData = {
            orders: {
              total: data.orders.total_orders,
              completed: data.orders.order_delivered,
              pending: data.orders.order_pending,
              shipped: data.orders.order_shipped
            },
            products: {
              total: data.products.total_products,
              inStock: data.products.in_stock,
              outOfStock: data.products.out_of_stock
            },
            customers: {
              total: data.customers.total_customers
            }
          };
          
          setDashboardStats(transformedData);
          setError(null);
        } catch (err) {
          console.error('Failed to fetch statistics:', err);
          setError('Failed to load dashboard statistics');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStatistics();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return null;
  }

  const statCards = [
    // Orders Section
    {
      title: "Total Orders",
      value: dashboardStats.orders.total,
      icon: HiShoppingCart,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50"
    },
    {
      title: "Orders Delivered",
      value: dashboardStats.orders.completed,
      icon: HiCheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50"
    },
    {
      title: "Orders Pending",
      value: dashboardStats.orders.pending,
      icon: HiClock,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgLight: "bg-yellow-50"
    },
    {
      title: "Orders Shipped",
      value: dashboardStats.orders.shipped,
      icon: HiTruck,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50"
    },
    // Products Section
    {
      title: "Total Products",
      value: dashboardStats.products.total,
      icon: HiCube,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgLight: "bg-indigo-50"
    },
    {
      title: "Products In Stock",
      value: dashboardStats.products.inStock,
      icon: HiCheck,
      color: "bg-teal-500",
      textColor: "text-teal-600",
      bgLight: "bg-teal-50"
    },
    {
      title: "Products Out of Stock",
      value: dashboardStats.products.outOfStock,
      icon: HiX,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgLight: "bg-red-50"
    },
    // Customers Section
    {
      title: "Total Customers",
      value: dashboardStats.customers.total,
      icon: HiUsers,
      color: "bg-pink-500",
      textColor: "text-pink-600",
      bgLight: "bg-pink-50"
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {session?.user?.user?.name || 'User'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${stat.textColor} dark:text-white`}>
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`${stat.bgLight} dark:${stat.color} p-3 rounded-lg`}>
                  <Icon className={`w-8 h-8 ${stat.textColor} dark:text-white`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Orders Summary */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Orders Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {((dashboardStats.orders.completed / dashboardStats.orders.total) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${(dashboardStats.orders.completed / dashboardStats.orders.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Products Summary */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Inventory Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">In Stock</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {((dashboardStats.products.inStock / dashboardStats.products.total) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-teal-600 h-2.5 rounded-full" 
                style={{ width: `${(dashboardStats.products.inStock / dashboardStats.products.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Avg. Orders/Customer</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {(dashboardStats.orders.total / dashboardStats.customers.total).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Pending Orders</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {dashboardStats.orders.pending}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}