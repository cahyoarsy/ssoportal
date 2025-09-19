import { useState, useEffect } from 'react';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      // Import getUserAnalytics dynamically to avoid circular dependencies
      const { getUserAnalytics } = await import('../authStorage');
      const data = getUserAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const maxRegistrations = Math.max(...analytics.registrationTrend.map(d => d.count), 1);
  const maxLogins = Math.max(...analytics.loginActivity.map(d => d.count), 1);

  return (
    <div className="space-y-8">
      {/* Registration Trend */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tren Pendaftaran (30 Hari Terakhir)</h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-end space-x-1 h-32">
            {analytics.registrationTrend.map((day, index) => (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                  style={{
                    height: `${(day.count / maxRegistrations) * 100}%`,
                    minHeight: day.count > 0 ? '4px' : '0px'
                  }}
                  title={`${day.date}: ${day.count} registrasi`}
                ></div>
                {index % 5 === 0 && (
                  <span className="text-xs text-gray-500 mt-1 transform rotate-45 origin-left">
                    {new Date(day.date).getDate()}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Total: {analytics.registrationTrend.reduce((sum, day) => sum + day.count, 0)} registrasi
          </div>
        </div>
      </div>

      {/* Login Activity */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Login (7 Hari Terakhir)</h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-end space-x-2 h-32">
            {analytics.loginActivity.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-500 rounded-t-sm transition-all duration-300 hover:bg-green-600"
                  style={{
                    height: `${(day.count / maxLogins) * 100}%`,
                    minHeight: day.count > 0 ? '4px' : '0px'
                  }}
                  title={`${day.date}: ${day.count} login`}
                ></div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Total: {analytics.loginActivity.reduce((sum, day) => sum + day.count, 0)} login
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Role</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Admin</span>
                <span className="text-sm font-medium">{analytics.roleDistribution.admin}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(analytics.roleDistribution.admin / (analytics.roleDistribution.admin + analytics.roleDistribution.user)) * 100}%`
                  }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">User</span>
                <span className="text-sm font-medium">{analytics.roleDistribution.user}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(analytics.roleDistribution.user / (analytics.roleDistribution.admin + analytics.roleDistribution.user)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Verifikasi</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Verified</span>
                <span className="text-sm font-medium">{analytics.verificationStatus.verified}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(analytics.verificationStatus.verified / (analytics.verificationStatus.verified + analytics.verificationStatus.pending)) * 100}%`
                  }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-medium">{analytics.verificationStatus.pending}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(analytics.verificationStatus.pending / (analytics.verificationStatus.verified + analytics.verificationStatus.pending)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Statistik</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {((analytics.loginActivity.reduce((sum, day) => sum + day.count, 0) / 7)).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Rata-rata Login/Hari</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {analytics.registrationTrend.slice(-7).reduce((sum, day) => sum + day.count, 0)}
            </div>
            <div className="text-sm text-gray-600">Registrasi 7 Hari</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {((analytics.roleDistribution.admin / (analytics.roleDistribution.admin + analytics.roleDistribution.user)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Persentase Admin</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {((analytics.verificationStatus.verified / (analytics.verificationStatus.verified + analytics.verificationStatus.pending)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Tingkat Verifikasi</div>
          </div>
        </div>
      </div>
    </div>
  );
}