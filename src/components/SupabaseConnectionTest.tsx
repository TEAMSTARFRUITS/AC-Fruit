import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ConnectionStatus {
  status: 'checking' | 'connected' | 'error';
  message: string;
  details?: any;
}

export function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'checking',
    message: 'Vérification de la connexion...'
  });

  const [tableTests, setTableTests] = useState<Record<string, ConnectionStatus>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus({
      status: 'checking',
      message: 'Vérification de la connexion...'
    });

    try {
      // Test 1: Vérifier les variables d'environnement
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log('Environment check:', {
        url: supabaseUrl,
        key: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'undefined'
      });

      if (!supabaseUrl || !supabaseKey) {
        setConnectionStatus({
          status: 'error',
          message: 'Variables d\'environnement manquantes',
          details: {
            VITE_SUPABASE_URL: !!supabaseUrl,
            VITE_SUPABASE_ANON_KEY: !!supabaseKey,
            currentUrl: supabaseUrl,
            currentKey: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'undefined'
          }
        });
        setIsLoading(false);
        return;
      }

      // Test 2: Test de connexion basique avec timeout
      console.log('Testing connection to:', supabaseUrl);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: connexion trop lente')), 10000)
      );

      const connectionPromise = supabase
        .from('fruits')
        .select('count', { count: 'exact', head: true });

      const { data, error } = await Promise.race([connectionPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Supabase connection error:', error);
        setConnectionStatus({
          status: 'error',
          message: `Erreur de connexion: ${error.message}`,
          details: {
            error: error,
            code: error.code,
            hint: error.hint,
            details: error.details
          }
        });
        setIsLoading(false);
        return;
      }

      console.log('Connection successful:', data);
      setConnectionStatus({
        status: 'connected',
        message: 'Connexion Supabase réussie',
        details: { 
          url: supabaseUrl,
          response: data 
        }
      });

      // Test 3: Tester chaque table
      await testTables();

    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus({
        status: 'error',
        message: `Erreur lors du test: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        details: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testTables = async () => {
    const tables = ['fruits', 'news', 'events', 'appearance', 'planifruits'];
    const results: Record<string, ConnectionStatus> = {};

    for (const table of tables) {
      try {
        console.log(`Testing table: ${table}`);
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error(`Error testing table ${table}:`, error);
          results[table] = {
            status: 'error',
            message: `Erreur: ${error.message}`,
            details: error
          };
        } else {
          console.log(`Table ${table} accessible, count:`, count);
          results[table] = {
            status: 'connected',
            message: `Accessible (${count || 0} entrées)`,
            details: { count }
          };
        }
      } catch (error) {
        console.error(`Exception testing table ${table}:`, error);
        results[table] = {
          status: 'error',
          message: 'Erreur de connexion',
          details: error
        };
      }
    }

    setTableTests(results);
  };

  const testInsert = async () => {
    try {
      console.log('Testing insert...');
      const testData = {
        category: 'abricots',
        name: 'Test Connexion ' + new Date().toISOString(),
        description: 'Test de connexion Supabase',
        image: 'https://images.unsplash.com/photo-1595411425732-e46469c14b8c?auto=format&fit=crop&q=80'
      };

      const { data, error } = await supabase
        .from('fruits')
        .insert(testData)
        .select();

      if (error) {
        console.error('Insert error:', error);
        alert(`Erreur d'insertion: ${error.message}`);
      } else {
        console.log('Insert successful:', data);
        alert('Insertion réussie! Données: ' + JSON.stringify(data, null, 2));
        
        // Nettoyer le test
        if (data && data[0]) {
          const { error: deleteError } = await supabase
            .from('fruits')
            .delete()
            .eq('id', data[0].id);
          
          if (deleteError) {
            console.error('Delete error:', deleteError);
          } else {
            console.log('Test data cleaned up');
          }
        }
      }
    } catch (error) {
      console.error('Insert exception:', error);
      alert(`Erreur: ${error}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600 animate-pulse" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Database className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold">Test de connexion Supabase</h2>
        {isLoading && <RefreshCw className="w-5 h-5 ml-2 animate-spin text-blue-600" />}
      </div>

      {/* Status principal */}
      <div className="mb-6 p-4 rounded-lg border">
        <div className="flex items-center mb-2">
          {getStatusIcon(connectionStatus.status)}
          <span className="ml-2 font-medium">{connectionStatus.message}</span>
        </div>
        {connectionStatus.details && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              Voir les détails
            </summary>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto mt-2 max-h-40">
              {JSON.stringify(connectionStatus.details, null, 2)}
            </pre>
          </details>
        )}
      </div>

      {/* Variables d'environnement */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Variables d'environnement</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <span className="w-32">SUPABASE_URL:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {import.meta.env.VITE_SUPABASE_URL || 'Non définie'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-32">SUPABASE_KEY:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? 
                `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 
                'Non définie'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Test des tables */}
      {Object.keys(tableTests).length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Test des tables</h3>
          <div className="space-y-2">
            {Object.entries(tableTests).map(([table, status]) => (
              <div key={table} className="flex items-center justify-between p-2 border rounded">
                <span className="font-medium">{table}</span>
                <div className="flex items-center">
                  {getStatusIcon(status.status)}
                  <span className="ml-2 text-sm">{status.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
        >
          {isLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
          Retester la connexion
        </button>
        <button
          onClick={testInsert}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300"
          disabled={connectionStatus.status !== 'connected' || isLoading}
        >
          Test d'insertion
        </button>
      </div>
    </div>
  );
}