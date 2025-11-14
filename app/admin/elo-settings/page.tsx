'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Database, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ELOSettingsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [syncLogs, setSyncLogs] = useState<any[]>([])
  
  const [settings, setSettings] = useState({
    elo_db_type: 'mssql',
    elo_db_host: '',
    elo_db_port: 1433,
    elo_db_name: '',
    elo_db_user: '',
    elo_db_password: '',
  })

  useEffect(() => {
    loadSettings()
    loadSyncLogs()
  }, [])

  async function loadSettings() {
    const { data } = await supabase
      .from('system_settings')
      .select('*')
      .single()
    
    if (data) {
      setSettings({
        elo_db_type: data.elo_db_type || 'mssql',
        elo_db_host: data.elo_db_host || '',
        elo_db_port: data.elo_db_port || 1433,
        elo_db_name: data.elo_db_name || '',
        elo_db_user: data.elo_db_user || '',
        elo_db_password: '', // Aus Sicherheitsgründen nicht anzeigen
      })
    }
  }

  async function loadSyncLogs() {
    const { data } = await supabase
      .from('elo_sync_logs')
      .select('*')
      .order('sync_started_at', { ascending: false })
      .limit(10)
    
    if (data) setSyncLogs(data)
  }

  async function saveSettings() {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/admin/elo-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage('Einstellungen gespeichert!')
        setTestStatus('idle')
      } else {
        setMessage(result.error || 'Fehler beim Speichern')
        setTestStatus('error')
      }
    } catch (error) {
      setMessage('Fehler beim Speichern der Einstellungen')
      setTestStatus('error')
    } finally {
      setLoading(false)
    }
  }

  async function testConnection() {
    setLoading(true)
    setTestStatus('idle')
    setMessage('')
    
    try {
      const response = await fetch('/api/admin/elo-test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        setTestStatus('success')
        setMessage(`Verbindung erfolgreich! ${result.documentCount} Dokumente gefunden.`)
      } else {
        setTestStatus('error')
        setMessage(result.error || 'Verbindung fehlgeschlagen')
      }
    } catch (error) {
      setTestStatus('error')
      setMessage('Fehler beim Testen der Verbindung')
    } finally {
      setLoading(false)
    }
  }

  async function startSync() {
    setSyncing(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/admin/elo-sync', {
        method: 'POST',
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage(`Sync gestartet! ${result.documentsSynced} Dokumente synchronisiert.`)
        await loadSyncLogs()
      } else {
        setMessage(result.error || 'Sync fehlgeschlagen')
      }
    } catch (error) {
      setMessage('Fehler beim Synchronisieren')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ELO-Datenbank Einstellungen</h1>
            <p className="text-gray-600 mt-2">Verbinde deine ELO-SQL-Datenbank für direkten Zugriff</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Zurück zum Admin</Button>
          </Link>
        </div>

        {/* Verbindungseinstellungen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Datenbankverbindung
            </CardTitle>
            <CardDescription>
              Gib die Verbindungsdaten zu deiner ELO-SQL-Datenbank ein
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="db_type">Datenbanktyp</Label>
                <select
                  id="db_type"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={settings.elo_db_type}
                  onChange={(e) => setSettings({ ...settings, elo_db_type: e.target.value })}
                >
                  <option value="mssql">MS SQL Server</option>
                  <option value="oracle">Oracle</option>
                  <option value="postgresql">PostgreSQL</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="db_name">Datenbankname</Label>
                <Input
                  id="db_name"
                  placeholder="ELO_DATABASE"
                  value={settings.elo_db_name}
                  onChange={(e) => setSettings({ ...settings, elo_db_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="db_host">Host/Server</Label>
                <Input
                  id="db_host"
                  placeholder="192.168.1.100 oder elo-server.local"
                  value={settings.elo_db_host}
                  onChange={(e) => setSettings({ ...settings, elo_db_host: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="db_port">Port</Label>
                <Input
                  id="db_port"
                  type="number"
                  placeholder="1433"
                  value={settings.elo_db_port}
                  onChange={(e) => setSettings({ ...settings, elo_db_port: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="db_user">Benutzername</Label>
                <Input
                  id="db_user"
                  placeholder="elo_readonly"
                  value={settings.elo_db_user}
                  onChange={(e) => setSettings({ ...settings, elo_db_user: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="db_password">Passwort</Label>
                <Input
                  id="db_password"
                  type="password"
                  placeholder="••••••••"
                  value={settings.elo_db_password}
                  onChange={(e) => setSettings({ ...settings, elo_db_password: e.target.value })}
                />
              </div>
            </div>

            {message && (
              <Alert className={testStatus === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
                <AlertDescription className={testStatus === 'error' ? 'text-red-900' : 'text-green-900'}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button onClick={saveSettings} disabled={loading} className="flex-1">
                {loading ? 'Speichern...' : 'Einstellungen speichern'}
              </Button>
              <Button onClick={testConnection} disabled={loading} variant="outline">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : testStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : testStatus === 'error' ? (
                  <XCircle className="w-4 h-4 text-red-600" />
                ) : (
                  'Verbindung testen'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sync-Steuerung */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Synchronisierung
            </CardTitle>
            <CardDescription>
              Synchronisiere Dokumente aus der ELO-Datenbank
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={startSync} 
              disabled={syncing || testStatus !== 'success'}
              className="w-full"
              size="lg"
            >
              {syncing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Synchronisiere...
                </>
              ) : (
                'Jetzt synchronisieren'
              )}
            </Button>

            {/* Sync Logs */}
            {syncLogs.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-700">Letzte Synchronisierungen:</h3>
                <div className="space-y-2">
                  {syncLogs.map((log) => (
                    <div 
                      key={log.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                    >
                      <div>
                        <div className="font-medium">
                          {log.documents_synced} Dokumente synchronisiert
                        </div>
                        <div className="text-gray-600 text-xs">
                          {new Date(log.sync_started_at).toLocaleString('de-DE')}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        log.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : log.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Hinweise zur ELO-Verbindung:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Die Verbindung benötigt nur <strong>Leserechte</strong> auf die ELO-Datenbank</li>
              <li>• Empfohlener Benutzer: Lege einen eigenen readonly-User in der ELO-Datenbank an</li>
              <li>• Die Synchronisierung läuft nur wenn ELO im Admin-Dashboard aktiviert ist</li>
              <li>• Bei der ersten Sync werden alle Dokumente importiert (kann länger dauern)</li>
              <li>• Weitere Syncs sind inkrementell und importieren nur neue/geänderte Dokumente</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
