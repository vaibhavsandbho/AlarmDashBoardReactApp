// services/alarmService.js
//const API_BASE_URL = 'http://localhost:8090/EquipmentAlarm';


const API_BASE_URL = 'http://localhost:8090';
// const API_BASE_URL = 'http://192.168.10.179:8090';

//const API_BASE_URL = 'http://localhost:8090/EquipmentAlarm';
//const API_BASE_URL = 'http://10.192.65.167:8090/EquipmentAlarm';

export class AlarmService {
  // Fetch filtered alarms from database
  static async fetchFilteredAlarms(filterParams) {
    // Prepare filter parameters
    const params = { ...filterParams };
    if (!params.status) params.status = 'NA';  // Handle undefined or null
    if (!params.fromDate) params.fromDate = 'NA';  // Handle undefined or null
    if (!params.toDate) params.toDate = 'NA';  // Handle undefined or null
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/fetchEquipmentAlarmByAllFilters/${params.status}/${params.fromDate}/${params.toDate}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Failed to load filtered alarms:', error);
      throw new Error('Failed to load filtered alarms');
    }
  }
}


// SSE Connection Manager
export class SSEConnectionManager {
  constructor(onUpdate, onError, onStatusChange) {
    this.eventSource = null;
    this.onUpdate = onUpdate;
    this.onError = onError;
    this.onStatusChange = onStatusChange;
    this.reconnectTimeout = null;
  }

  connect() {
    this.onStatusChange('connecting');
    
    try {
      this.eventSource = new EventSource(`${API_BASE_URL}/alarm/stream`);

      this.eventSource.onopen = () => {
        console.log('SSE connection opened');
        this.onStatusChange('connected');
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.eventSource.addEventListener("alarm-update", (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('SSE alarm-update received:', data);
          this.onUpdate(data);
        } catch (parseError) {
          console.error('Error parsing SSE data:', parseError);
          this.onError('Error parsing real-time data');
        }
      });

      this.eventSource.onerror = (err) => {
        console.error("SSE connection error:", err);
        this.onStatusChange('disconnected');
        this.onError("Real-time connection failed. Attempting to reconnect...");
        
        // Auto-reconnect after 5 seconds
        this.reconnectTimeout = setTimeout(() => {
          this.reconnect();
        }, 5000);
      };

    } catch (err) {
      console.error('Failed to establish SSE connection:', err);
      this.onStatusChange('disconnected');
      this.onError('Failed to establish real-time connection');
    }
  }

  reconnect() {
    this.disconnect();
    setTimeout(() => {
      this.connect();
    }, 1000);
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}