package com.healthcare.service;

import com.healthcare.model.Usuario;
import com.healthcare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    
    public List<Usuario> obtenerTodosLosUsuarios() {
        log.info("Obteniendo todos los usuarios");
        return usuarioRepository.findAll();
    }
    
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        log.info("Obteniendo usuario por ID: {}", id);
        return usuarioRepository.findById(id);
    }
    
    public Optional<Usuario> obtenerUsuarioPorEmail(String email) {
        log.info("Obteniendo usuario por email: {}", email);
        return usuarioRepository.findByEmail(email);
    }
    
    public Usuario crearUsuario(Usuario usuario) {
        log.info("Creando nuevo usuario: {}", usuario.getEmail());
        
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con el email: " + usuario.getEmail());
        }
        
        return usuarioRepository.save(usuario);
    }
    
    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        log.info("Actualizando usuario con ID: {}", id);
        
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        
        // Verificar que el email no esté en uso por otro usuario
        if (!usuario.getEmail().equals(usuarioActualizado.getEmail()) && 
            usuarioRepository.existsByEmail(usuarioActualizado.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con el email: " + usuarioActualizado.getEmail());
        }
        
        usuario.setEmail(usuarioActualizado.getEmail());
        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setApellido(usuarioActualizado.getApellido());
        usuario.setEdad(usuarioActualizado.getEdad());
        usuario.setGenero(usuarioActualizado.getGenero());
        usuario.setPesoKg(usuarioActualizado.getPesoKg());
        usuario.setAlturaCm(usuarioActualizado.getAlturaCm());
        usuario.setNivelActividad(usuarioActualizado.getNivelActividad());
        usuario.setObjetivoSalud(usuarioActualizado.getObjetivoSalud());
        
        return usuarioRepository.save(usuario);
    }
    
    public void eliminarUsuario(Long id) {
        log.info("Eliminando usuario con ID: {}", id);
        
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        
        usuarioRepository.deleteById(id);
    }

    public Optional<Usuario> login(String email, String password) {
        log.info("Intentando login para email: {}", email);
        return usuarioRepository.findByEmailAndPassword(email, password);
    }

    public void actualizarPassword(Long id, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        usuario.setPassword(nuevaPassword);
        usuarioRepository.save(usuario);
    }
}
